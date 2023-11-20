import React, { useRef, useState } from "react";
import {
    Button,
    ButtonToolbar,
    Col,
    Form,
    Grid,
    InputPicker,
    List,
    Modal,
    Row,
    Schema,
} from "rsuite";
import HttpClient from "./helpers/HttpClient";
import { ProjectStatusNames } from "./helpers/Enums";
import PageWrapper from "./layout/PageWrapper";
import Field from "./components/Field";
import ModalContact from "./modals/ModalContact";
import ModalContactNew from "./modals/ModalContactNew";

const { StringType, NumberType } = Schema.Types;
const model = Schema.Model({
    name: StringType().isRequired("Kötelező mező"),
    description: StringType().isRequired("Kötelező mező"),
    status: NumberType("Nem megfelelő státusz")
        .range(0, 2, "Kérem válasszon érvényes státuszt.")
        .isRequired("Kötelező mező"),
});

const PageProjectEdit: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [contacts, setContacts] = useState<IContact[]>([]);
    const [showContactModal, setShowContactModal] = useState<boolean>(false);
    const [contactModal, setContactModal] = useState<IContact | null>(null);

    const formRef = useRef<any>();
    const [formError, setFormError] = useState({});
    const [formValue, setFormValue] = useState({
        name: "",
        description: "",
        status: 0,
    });

    const handleSubmit = () => {
        if (!formRef.current.check()) {
            return;
        }

        setLoading(true);
        HttpClient({
            url: `/api/project`,
            method: "post",
            data: {
                name: formValue.name,
                description: formValue.description,
                status: formValue.status,
                contacts: contacts.map((c) => ({
                    name: c.name,
                    email: c.email,
                })),
            },
        })
            .then((res: any) => {
                window.addNotification("success", "Sikeres mentés");
                window.location.href = `/${res.data.id}`;
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteContact = (contact: IContact) => {
        setContacts((prev) => prev.filter((p) => p.id !== contact.id));
    };

    return (
        <PageWrapper>
            <Grid>
                <Row style={{ marginBottom: 15 }}>
                    <Col md={24}>
                        <h1 style={{ padding: "40px 0" }}>
                            Új projekt létrehozása
                        </h1>

                        <Form
                            ref={formRef}
                            // @ts-ignore
                            onChange={setFormValue}
                            onCheck={setFormError}
                            formValue={formValue}
                            model={model}
                            fluid
                        >
                            <Field name="name" label="Név" />
                            <Field name="description" label="Leírás" />
                            <Field
                                name="status"
                                label="Státusz"
                                accepter={InputPicker}
                                data={ProjectStatusNames.map(
                                    (value, index) => ({
                                        label: value,
                                        value: index,
                                    })
                                )}
                                cleanable={false}
                                block
                            />
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col md={24}>
                        <Form.Group>
                            <Form.ControlLabel>
                                Kapcsolattartók
                            </Form.ControlLabel>
                            <List bordered>
                                {contacts.length === 0 ? (
                                    <List.Item>
                                        <i>Nem található kapcsolattató</i>
                                    </List.Item>
                                ) : (
                                    <>
                                        {contacts.map((contact) => (
                                            <List.Item
                                                key={`contact-${contact.id}`}
                                            >
                                                {`${contact.name} - ${contact.email}`}
                                                <Button
                                                    appearance="link"
                                                    size="xs"
                                                    onClick={() => {
                                                        setContactModal(
                                                            contact
                                                        );
                                                        setShowContactModal(
                                                            true
                                                        );
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Szerkeszéts
                                                </Button>
                                                <Button
                                                    appearance="link"
                                                    color="red"
                                                    size="xs"
                                                    onClick={() =>
                                                        handleDeleteContact(
                                                            contact
                                                        )
                                                    }
                                                    disabled={loading}
                                                >
                                                    Törlés
                                                </Button>
                                            </List.Item>
                                        ))}
                                    </>
                                )}
                            </List>
                            <Button
                                style={{ marginTop: 15 }}
                                onClick={() => setShowContactModal(true)}
                            >
                                Új kapcsolattartó
                            </Button>
                        </Form.Group>

                        <ButtonToolbar style={{ marginTop: 30 }}>
                            <Button
                                appearance="primary"
                                onClick={handleSubmit}
                                loading={loading}
                            >
                                Létrehozás
                            </Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Grid>
            <ModalContactNew
                contact={contactModal}
                open={showContactModal}
                onClose={() => {
                    setShowContactModal(false);
                    setContactModal(null);
                }}
                onSave={(values: any, contact: IContact | null) => {
                    if (contact) {
                        setContacts((prev) =>
                            prev.map((p) => {
                                if (p.id === contact.id) {
                                    return {
                                        name: values.name,
                                        email: values.email,
                                    };
                                }
                                return p;
                            })
                        );
                        return;
                    }

                    setContacts((prev) => [
                        ...prev,
                        {
                            id: Date.now(),
                            name: values.name,
                            email: values.email,
                        },
                    ]);
                }}
            />
        </PageWrapper>
    );
};
export default PageProjectEdit;
