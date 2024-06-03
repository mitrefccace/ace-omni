import React from 'react';
import Form from 'react-bootstrap/Form';

interface Props {
  id?: string;
  label?: string;
  children: any;
}

/**
 * Creates an ADS Checkbox Group
 *
 * @param id - An id for css purposes
 * @param label - Label to be displayed on checkbox group
 * @param children - checkboxes to be in group
 *
 * @returns ADS Checkbox Group
 */

function ADSCheckboxGroup({
  id, label, children
}: Props) {
  return (
    <Form
      id={id}
      className="checkbox-group"
    >
      <Form.Label className="body2">{label}</Form.Label>
      <div role="group" aria-label={label}>
        {children}
      </div>
    </Form>
  );
}

ADSCheckboxGroup.defaultProps = {
  id: '',
  label: ''
};

export default ADSCheckboxGroup;
