import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    viewBox="0 96 960 960"
    width="1em"
    fill={'currentColor'}
    {...props}
  >
    <path d="m168 772 148-398h48l149 398h-48l-39-111H254l-39 111h-47Zm101-151h142l-70-196h-2l-70 196Zm393 160q-44 0-70-23.5T566 694q0-42 30.5-68.5T676 599q21 0 41 4t34 12v-20q0-35-19-54t-55-19q-21 0-39 7.5T604 552l-29-25q21-22 45.5-32t56.5-10q57 0 86 28.5t29 85.5v173h-40v-38h-4q-14 23-35.5 35T662 781Zm3-35q37 0 62-27.5t25-68.5q-13-8-31.5-12t-36.5-4q-35 0-55.5 16T608 694q0 24 15.5 38t41.5 14Z" />
  </svg>
);

export default SvgComponent;
