import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Schema } from "rsuite";
import ModalWrapper from "../wrappers/ModalWrapper";
import Form from "rsuite/Form";
import Field from "../components/Field";
import HttpClient from "../helpers/HttpClient";

interface IProps {
    contact: IContact | null;
    open: boolean;
    onClose: () => void;
    onSave: (contact: IContact, isCreate: boolean) => void;
}

const validationRules = Schema.Model({
    name: Schema.Types.StringType().isRequired("Kötelező mező"),
    email: Schema.Types.StringType()
        .isRequired("Kötelező mező")
        .isEmail("Nem érvényes e-mail formátum"),
});

const ModalContact: React.FC<IProps> = ({ contact, open, onClose, onSave }) => {
    const formRef = useRef<any>();
    const [loading, setLoading] = useState<boolean>(false);
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

        setLoading(true);

        if (contact) {
            HttpClient({
                url: `/api/contact/${contact.id}`,
                method: "post",
                data: formValue,
            })
                .then((res: any) => {
                    window.addNotification("success", "Sikeres mentés");
                    onSave(res.data, false);
                    onClose();
                })
                .finally(() => {
                    setLoading(false);
                });
            return;
        }

        HttpClient({
            url: `/api/contact`,
            method: "post",
            data: formValue,
        })
            .then((res: any) => {
                window.addNotification("success", "Sikeres létrehozás");
                onSave(res.data, true);
                onClose();
            })
            .finally(() => {
                setLoading(false);
            });
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
                    loading={loading}
                >
                    {contact ? "Mentés" : "Létrehozás"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalContact;
