import pathlib
import nanoid
from datetime import datetime

from flask import make_response, jsonify, request
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename

from sqlalchemy.exc import IntegrityError

from riot_buddy import app, db, s3, bucket_name, cloudfront_url
from .models import Photo

@app.route('/api/v1/profile/photo', methods=['PUT'])
@login_required
def upload_photo():
    # gets the pfp from the request
    pfp = request.files['pfp']

    # only attempt upload if photo is present in upload
    if pfp:
      file = secure_filename(pfp.filename)

      # get the extension of the uploaded file (.png, .jpeg, etc.)
      extension = pathlib.Path(file).suffix

      # make sure its a valid extension
      if extension not in ['.png', '.jpg', '.jpeg', '.heic', '.webp']:
        return make_response(jsonify(error="error uploading photo: file extension not allowed"), 200)

      # generate random file name and use original file extension
      path = f'{nanoid.generate()}{extension}'

      # upload the file
      s3.put_object(Bucket=bucket_name, Body=pfp, Key=path)

      # get photo record from users profile
      photo = Photo.query.filter_by(id=current_user.id).first()

      if not photo:
        # if first time uploading photo, create new Photo object
        photo = Photo(
          id=current_user.id,
          type=1,
          url=f'https://{cloudfront_url}/{path}',
          uploaded=datetime.utcnow())
      else:
        # if Photo exists for user, delete the old file and update the database with new url
        s3.delete_object(Bucket=bucket_name, Key=pathlib.Path(photo.url).name)
        photo.type = 1
        photo.url = f'https://{cloudfront_url}/{path}'
        photo.uploaded = datetime.utcnow()

      try:
        db.session.add(photo)
        db.session.commit()
      except IntegrityError:
        db.session.rollback()
        return make_response(jsonify(error="error uploading photo"), 200)

    return make_response(jsonify(error=""), 200)
