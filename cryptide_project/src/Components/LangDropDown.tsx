import React from 'react';

import { NavDropdown } from 'react-bootstrap';
import LanguageNavItem from './LangNavItem';
import { HiLanguage } from 'react-icons/hi2';
import ReactCountryFlag from 'react-country-flag';

//@ts-ignore
const localToCountryCode = (locale) => {
  switch (locale) {
    case 'fr':
      return 'FR';
    case 'en':
      return 'GB';
    case 'es':
      return 'ES';
    case 'pt':
      return 'PT';
    case 'ru':
      return 'RU';
    default:
      return 'FR';
  }
};


// @ts-ignore
const LangDropdown = ({ changeLocale, locale}) => {
  const selectedcountryCode = localToCountryCode(locale);
  return (
    <NavDropdown title={
      <ReactCountryFlag
        className="custom-flag"
        countryCode={selectedcountryCode === null ? 'FR' : selectedcountryCode}
        svg
        style={{ margin: 'auto 10px 3px auto' }}
      />
    } id="language-dropdown" align='end' drop='down-centered'>
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
      <LanguageNavItem
        countryCode="ES"
        languageKey="languageSelector.espagnol"
        onClick={() => changeLocale('es')}
      />
      <LanguageNavItem
        countryCode="PT"
        languageKey="languageSelector.portuguese"
        onClick={() => changeLocale('pt')}
      />
      <LanguageNavItem
        countryCode="RU"
        languageKey="languageSelector.russian"
        onClick={() => changeLocale('ru')}
      />
    </NavDropdown>
  );
};

export default LangDropdown;
