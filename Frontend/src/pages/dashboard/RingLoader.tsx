import React from 'react';
import styled from 'styled-components';

const LoaderWrap = styled.div`
  width: 100px;
  aspect-ratio: 1;
  padding: 10px;
  box-sizing: border-box;
  display: grid;
  background: blue; /* Corrected background color */
  filter: blur(3px) contrast(7) hue-rotate(290deg);
  mix-blend-mode: darken;

  &::before {
    content: "";
    margin: auto;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: red;
    background: #fff;
    box-shadow: -30px 0, 30px 0, 0 30px, 0 -30px;
    animation: l6 1s infinite alternate;
  }

  @keyframes l6 {
    90%, 100% {
      box-shadow: -10px 0, 10px 0, 0 10px, 0 -10px;
      transform: rotate(180deg);
    }
  }
`;

const CSSLoader = () => {
  return <LoaderWrap className="loader"></LoaderWrap>;
};

export default CSSLoader;
