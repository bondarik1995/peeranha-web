/* eslint no-param-reassign: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TEXT_PRIMARY, BORDER_PRIMARY } from 'style-constants';
import closeIcon from 'images/closeCircle.svg?inline';

import { Select2 } from 'components/FormFields/SelectField';
import Dropdown from 'components/Dropdown/AllowedClickInside';
import Wrapper from 'components/FormFields/Wrapper';
import { Input } from 'components/Input/InputStyled';

const TagsContainer = styled.ul`
  ${props => Input(props)};

  cursor: pointer;
  height: auto !important;
`;

const RemoveTagIcon = styled.button`
  display: inline-flex;
  padding: 0 0 0 10px;
`;

const Tag = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${TEXT_PRIMARY};
  padding: 2px 8px;
  margin: 5px 10px 5px 0;
  border: 1px solid ${BORDER_PRIMARY};
  border-radius: 2px;
`;

const Base = styled.div`
  margin-bottom: ${({ isOpen }) => (isOpen ? 120 : 0)}px;
`;

export const TagSelector = ({
  input,
  meta,
  label,
  tip,
  setTags,
  disabled,
  splitInHalf,
  options = [],
}) => {
  if (input) {
    input.value = input.value.toJS ? input.value.toJS() : input.value;
  }

  const value = input.value || [];

  const [isOpen, toggleOpen] = useState(false);

  const valueIds = value.map(x => x.id);

  // In menu show only which are NOT chosen
  const filteredOptions = options.filter(x => !valueIds.includes(x.id));

  return (
    <Base isOpen={isOpen}>
      <Wrapper
        label={label}
        tip={tip}
        meta={meta}
        splitInHalf={splitInHalf}
        disabled={disabled}
        id={input.name}
      >
        <Dropdown
          isOpen={isOpen}
          toggle={() => toggleOpen(!isOpen)}
          target={
            <TagsContainer
              disabled={disabled}
              error={meta.touched && (meta.warning || meta.error)}
            >
              {value.map(x => (
                <Tag key={x.label}>
                  <span>{x.label}</span>
                  <RemoveTagIcon
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setTags(value.filter(y => y.id !== x.id));
                    }}
                  >
                    <img src={closeIcon} alt="X" />
                  </RemoveTagIcon>
                </Tag>
              ))}
            </TagsContainer>
          }
        >
          <Select2
            input={{
              ...input,
              value: null,
              onBlur: null,
              onChange: x => setTags([...value, x]),
            }}
            options={filteredOptions}
            disabled={disabled}
            autoFocus
            menuIsOpen
            isWrapped
          />
        </Dropdown>
      </Wrapper>
    </Base>
  );
};

TagSelector.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.string,
  tip: PropTypes.string,
  splitInHalf: PropTypes.bool,
  setTags: PropTypes.func,
  options: PropTypes.array,
  disabled: PropTypes.bool,
};

export default TagSelector;
