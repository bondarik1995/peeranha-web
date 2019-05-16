import { BG_WARNING_LIGHT, TEXT_LIGHT } from 'style-constants';
import IconStyled from 'components/Icon/IconStyled';

import Button from '../index';

export default Button.extend`
  background: ${BG_WARNING_LIGHT};
  color: ${TEXT_LIGHT};

  ${IconStyled} {
    stroke: ${TEXT_LIGHT};
  }
`;
