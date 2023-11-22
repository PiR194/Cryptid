import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import ReactCountryFlag from 'react-country-flag';

/*@ts-ignore*/
const LanguageNavItem = ({ countryCode, languageKey, onClick }) => {
  return (
    <NavDropdown.Item onClick={onClick}>
      <ReactCountryFlag
        className="custom-flag"
        countryCode={countryCode}
        svg
        style={{ margin: 'auto 10px 3px auto' }}
      />
      <FormattedMessage id={languageKey} />
    </NavDropdown.Item>
  );
};

export default LanguageNavItem;
