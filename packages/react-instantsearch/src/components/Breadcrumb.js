import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import Link from './Link';
import classNames from './classNames.js';
import translatable from '../core/translatable';
import BaseWidget from './BaseWidget';

const widgetClassName = 'Breadcrumb';
const cx = classNames(widgetClassName);

const itemsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })
);

class Breadcrumb extends Component {
  static propTypes = {
    canRefine: PropTypes.bool.isRequired,
    createURL: PropTypes.func.isRequired,
    items: itemsPropType,
    refine: PropTypes.func.isRequired,
    rootURL: PropTypes.string,
    separator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    translate: PropTypes.func.isRequired,
    header: PropTypes.node,
    footer: PropTypes.node,
  };

  static contextTypes = {
    canRefine: PropTypes.func,
  };

  componentWillMount() {
    if (this.context.canRefine) this.context.canRefine(this.props.canRefine);
  }

  componentWillReceiveProps(props) {
    if (this.context.canRefine) this.context.canRefine(props.canRefine);
  }

  render() {
    const {
      canRefine,
      createURL,
      items,
      refine,
      rootURL,
      separator,
      translate,
      header,
      footer,
    } = this.props;
    const rootPath = canRefine ? (
      <li {...cx(['item'])}>
        <Link
          {...cx(['link'])}
          onClick={() => (!rootURL ? refine() : null)}
          href={rootURL ? rootURL : createURL()}
        >
          {translate('rootLabel')}
        </Link>
      </li>
    ) : null;

    const breadcrumb = items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      return (
        <Fragment key={idx}>
          <li {...cx(['item'])} key="separator">
            {separator}
          </li>
          <li {...cx(['item', isLast && 'item--selected'])} key={idx}>
            {!isLast ? (
              <Link
                {...cx(['link'])}
                onClick={() => refine(item.value)}
                href={createURL(item.value)}
                key={idx}
              >
                {item.label}
              </Link>
            ) : (
              item.label
            )}
          </li>
        </Fragment>
      )
    });

    return (
      <BaseWidget
        widgetClassName={widgetClassName}
        otherWidgetClassNames={[!canRefine && `-noRefinement`]}
        header={header}
        footer={footer}
      >
        <ul {...cx(['list'])}>
          {rootPath}
          {breadcrumb}
        </ul>
      </BaseWidget>
    );
  }
}

export default translatable({
  rootLabel: 'Home',
})(Breadcrumb);
