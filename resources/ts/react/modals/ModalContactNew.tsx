import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Schema } from "rsuite";
import Form from "rsuite/Form";
import Field from "../components/Field";

interface IProps {
    contact: IContact | null;
    open: boolean;
    onClose: () => void;
    onSave: (values: any, contact: IContact | null) => void;
}

const validationRules = Schema.Model({
    name: Schema.Types.StringType().isRequired("Kötelező mező"),
    email: Schema.Types.StringType()
        .isRequired("Kötelező mező")
        .isEmail("Nem érvényes e-mail formátum"),
});

const ModalContactNew: React.FC<IProps> = ({
    contact,
    open,
    onClose,
    onSave,
}) => {
    const formRef = useRef<any>();
    const [formValue, setFormValue] = useState<any>({
        name: "",
        email: "",
    });
    useEffect(() => {
        if (open) {
            if (contact) {
                setFormValue({
                    name: contact.name,
                    email: contact.email,
                });
            } else {
                setFormValue({
                    name: "",
                    email: "",
                });
            }
        }
    }, [open]);

    const handleSave = async () => {
        if (!formRef.current.check()) {
            return;
        }

        onSave(formValue, contact);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>Kapcsolattartó</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    ref={formRef}
                    onChange={setFormValue}
                    formValue={formValue}
                    model={validationRules}
                    fluid
                >
                    <Field name="name" label="Név" />
                    <Field name="email" label="E-mail cím" />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    appearance="primary"
                    color="blue"
                    onClick={() => handleSave()}
                >
                    {contact ? "Mentés" : "Létrehozás"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalContactNew;
