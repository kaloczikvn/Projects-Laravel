import React from "react";
import { forwardRef } from "react";
import { Form } from "rsuite";

export const Field = forwardRef((props: any, ref: any) => {
    const { name, label, accepter, ...rest } = props;
    return (
        <Form.Group controlId={`${name}-id`} ref={ref}>
            <Form.ControlLabel>{label} </Form.ControlLabel>
            <Form.Control name={name} accepter={accepter} {...rest} />
        </Form.Group>
    );
});
export default Field;
