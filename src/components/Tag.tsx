import React, { useState } from 'react';
import styled from 'styled-components';

interface TagProps {
  text: string;
  color: string;
  togglable?: boolean;
}

const generateColorScheme = (color: string, enabled: boolean) => {
  if (!/^#[0-9A-F]{6}$/i.test(color)) {
    throw new Error("Invalid color format");
  }
  const shadeFactor = enabled ? 1.2 : 0.8;
  const shadedColor = shadeColor(color, shadeFactor);
  return {
    backgroundColor: shadedColor,
    color: enabled ? 'white' : 'grey',
    border: `1px solid ${enabled ? shadedColor : 'grey'}`
  };
};

const shadeColor = (color: string, factor: number) => {
  let colorInt = parseInt(color.slice(1), 16);
  let r = Math.floor(((colorInt >> 16) & 255) * factor);
  let g = Math.floor(((colorInt >> 8) & 255) * factor);
  let b = Math.floor((colorInt & 255) * factor);
  r = Math.min(255, r);
  g = Math.min(255, g);
  b = Math.min(255, b);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const TagStyled = styled.div<{ enabled: boolean; color: string; togglable: boolean }>`
  display: inline-block;
  padding: 0.5em 1em;
  border-radius: 0.25em;
  cursor: ${({ togglable }) => (togglable ? 'pointer' : 'default')};
  user-select: none;
  ${({ color, enabled }) => generateColorScheme(color, enabled)}
`;

const Tag: React.FC<TagProps> = ({ text, color, togglable = false }) => {
  const [enabled, setEnabled] = useState(true);

  const toggle = () => {
    if (togglable) {
      setEnabled(!enabled);
    }
  };

  return (
    <TagStyled
      color={color}
      enabled={enabled}
      togglable={togglable}
      onClick={toggle}
    >
      {text}
    </TagStyled>
  );
};

export default Tag;
