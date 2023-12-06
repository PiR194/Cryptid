import React from 'react';

import { NavDropdown } from 'react-bootstrap';
import LanguageNavItem from './LangNavItem';
import { HiLanguage } from 'react-icons/hi2';

// @ts-ignore
const LangDropdown = ({ changeLocale }) => {
  return (
    <NavDropdown title={<HiLanguage/>} id="language-dropdown" align='end' drop='down-centered'>
      <LanguageNavItem
        countryCode="FR"
        languageKey="languageSelector.french"
        onClick={() => changeLocale('fr')}
      />
      <LanguageNavItem
        countryCode="GB"
        languageKey="languageSelector.english"
        onClick={() => changeLocale('en')}
      />
    </NavDropdown>
  );
};

export default LangDropdown;
