import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ADSButton from './ADSButton';
import './ADSBreadcrumbs.css';

/**
 * Returns an ADS Breadcrumb Element
 *
 * @param className - CSS class to use
 * @param isCustom - present if you want to customizse breadcrumbs
 * @param customCrubms - object that contains custom breadcrumb values {text: string, path: string}
 *
 * @returns ADS Breadcrumb
 */

export default function ADSBreadcrumbs(props: {
  className?: string;
  isCustom?: boolean;
  customCrumbs?: CustomCrumbType[];
}) {
  const {
    className, isCustom, customCrumbs
  } = props;

  const location = useLocation();
  const last = location.pathname.split('/');
  const curr = last[last.length - 1];

  let currLink = '';
  const crumbs = location.pathname.split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      currLink += `/${crumb}`;
      return (
        <div className="ads-crumb" key={crumb}>
          {(crumb === curr)
            ? (
              <ADSButton
                height="small"
                buttonText={crumb}
                variant="tertiary"
                disabled
                className="breadcrumb-disabled"
                onClick={() => { }}
              />
            ) : (
              <>
                <Link to={currLink}>
                  <ADSButton
                    height="small"
                    buttonText={crumb}
                    variant="tertiary"
                    onClick={() => { }}
                  />
                </Link>
                <span className="breadcrumb-chevron">
                  <FontAwesomeIcon icon={faChevronRight} />
                </span>
              </>
            )}
        </div>
      );
    });

  const customCrumbList = customCrumbs?.map((item: any, index: any) => (
    <div className="ads-crumb" key={item.text}>
      {(customCrumbs.length - 1 === index)
        ? (
          <ADSButton
            height="small"
            buttonText={item.text}
            variant="tertiary"
            disabled
            className="breadcrumb-disabled"
            onClick={() => { }}
          />
        ) : (
          <>
            <Link to={item.path}>
              <ADSButton
                height="small"
                buttonText={item.text}
                variant="tertiary"
                onClick={() => { }}
              />
            </Link>
            <span className="breadcrumb-chevron">
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
          </>
        )}
    </div>
  ) as any);

  return (
    <div className="ads-breadcrumb-container">
      {
        isCustom
          ? (
            <div className={`ads-breadcrumb ${className}`}>
              {customCrumbList}
            </div>
          ) : (
            <div className={`ads-breadcrumb ${className}`}>
              {crumbs}
            </div>
          )
      }
    </div>
  );
}

interface CustomCrumbType {
  text: string;
  path: string;
}

ADSBreadcrumbs.defaultProps = {
  className: '',
  isCustom: false,
  customCrumbs: []
};
