import React from 'react'
import styled, { keyframes } from 'styled-components'

export const Ripple = props => <RippleDiv {...props} />
export const Spinner = props => <SpinnerDiv {...props} />

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const SpinnerDiv = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  border-top-color: transparent;
  animation: ${rotate360} 1s ease-in-out infinite;
`

const skBounce = keyframes`
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
`

const RippleDiv = styled.div`
  width: 40px;
  height: 40px;

  position: relative;
  margin: 100px auto;

  &::before,
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #333;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    animation: ${skBounce} 2s infinite ease-in-out;
  }

  &::after {
    animation-delay: -1s;
  }
`
