import styled from 'styled-components';
import cursorPointer from '../images/cursor-pointer.png'
import { Link } from 'react-router-dom';

export const InvalidText = styled.div`
  font-size: 1rem;
  color: red;
`

export const Table = styled.table`
  margin-left: auto;
  margin-right: auto;
  border: 2px solid #C8AA6E;
  padding: 20px;
  border-radius: 10px;
`

export const Label = styled.label`
  display: block;
  color: #C8AA6E;
  font-size: 25px;
`

export const Upload = styled.input`
  display: 'block';
  font-family: 'Beaufort', serif;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 1px;

  /* padding: 5px 15px;
  margin: 5px 5px; */

  color: #cdbe91;

  width: 250px;
`

export const Input = styled.input`
  width: 250px;
  font-family: 'Beaufort', serif;
  font-size: 25px;
  font-weight: bold;
  letter-spacing: 1px;

  padding: 5px 5px;
  margin: 5px 5px;

  background: #1e2328;
  color: #cdbe91;

  box-shadow: inset 0 0 2px #000000;
  //border-image: linear-gradient(to top, #785A28, #C89B3C);
  border-image-slice: 1;
  border-width: 0.5px;

  &:hover {
    text-shadow: 0 0 2px #ffffff80;
    box-shadow: 0 0 6px 0 #ffffff50;
    transition: 0.1s;
  }
`

export const RiotStyleButton = styled.button`
  font-family: 'Beaufort', serif;
  font-size: 25px;
  font-weight: bold;
  letter-spacing: 1px;

  padding: 5px 15px;
  margin: 10px 5px;

  background: #1e2328;
  color: #cdbe91;

  box-shadow: inset 0 0 2px #000000;
  border-image: linear-gradient(to top, #785A28, #C89B3C);
  border-image-slice: 1;
  border-width: 2px;

  &:hover {
    text-shadow: 0 0 5px #ffffff80;
    box-shadow: 0 0 8px 0 #ffffff50;
    background: linear-gradient(to bottom, #1e2328, #433d2b);
    cursor: url(${cursorPointer}), pointer;
    transition: 0.1s;
  }

  &:active {
    text-shadow: none;
    box-shadow: none;
    color: #cdbe9130;
  }
`

export const CircularRiotStyleButton = styled(RiotStyleButton)`
  font-size: 25px;

  width: 75px;
  height: 75px;

  border-color: #7a5c29;
  border-radius: 50%;

  box-shadow: none;
  border-image: none;
`


export const Bar = styled.div`
  margin: auto;
  margin: 15px 15px;
  display: flex;
  justify-content: center;
  text-align: center;
`

export const BarItem = styled(Link)`
  font-family: inherit;
  text-transform: uppercase;
  text-decoration: none;
  color: #0397AB;
  padding: 0px 25px 0px 25px;

  &.profile[href='/profile'] {
    color: #0AC8B9;
  }

  &.chat[href='/chat'] {
    color: #0AC8B9;
  }

  &.matchmaking[href='/matchmaking'] {
    color: #0AC8B9;
  }

  &:hover {
    text-shadow: 0 0 15px #ffffff80;
    cursor: url(${cursorPointer}), pointer;
    transition: 0.1s;
  }
`
