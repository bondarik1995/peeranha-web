import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { formatStringToHtmlId } from 'utils/animation';

import {
  BG_LIGHT,
  BORDER_SECONDARY,
  BG_PRIMARY_DARK,
  BORDER_PRIMARY_DARK,
} from 'style-constants';

import checkedIcon from 'images/okay.svg?inline';

import Span from 'components/Span';
import { ErrorHandling, DisableHandling } from './InputStyled';

export const Icon = styled.span`
  background: ${BG_LIGHT};
  min-width: 22px;
  min-height: 22px;
  border-radius: 3px;
  margin-right: 10px;
  display: inline-block;
  background-image: url(${x => (x.value ? checkedIcon : '')});
  background-color: ${x => (x.value ? BG_PRIMARY_DARK : BG_LIGHT)};
  background-repeat: no-repeat;
  background-position: center;
  z-index: 10;
  cursor: pointer;

  ${({ error }) => ErrorHandling(error)};
  ${({ disabled }) => DisableHandling(disabled)};

  border: 1px solid ${x => (x.value ? BORDER_PRIMARY_DARK : BORDER_SECONDARY)};
`;

const Input = Icon.extend`
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;
`.withComponent('input');

export const Label = Span.extend`
  font-size: 16px;
  line-height: 22px;
  cursor: pointer;
  flex: 1;
  opacity: ${x => (x.disabled ? '0.6' : '1')};
`.withComponent('label');

/* eslint jsx-a11y/label-has-for: 0 */
const Checkbox = ({ input, label, disabled, meta }) => (
  <div className="d-flex align-items-start">
    <div className="position-relative d-inline-flex">
      <Icon
        value={input.value}
        disabled={disabled}
        error={meta.touched && (meta.error || meta.warning)}
      />
      <Input
        {...input}
        type="checkbox"
        id={formatStringToHtmlId(input.name)}
        name={input.name}
        disabled={disabled}
      />
    </div>

    <Label htmlFor={formatStringToHtmlId(input.name)} disabled={disabled}>
      {label}
    </Label>
  </div>
);

Checkbox.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
};

export default Checkbox;
