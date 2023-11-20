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

const { StringType, NumberType } = Schema.Types;
const model = Schema.Model({
    name: StringType().isRequired("Kötelező mező"),
    description: StringType().isRequired("Kötelező mező"),
    status: NumberType("Nem megfelelő státusz")
        .range(0, 2, "Kérem válasszon érvényes státuszt.")
        .isRequired("Kötelező mező"),
});

interface IProps {
    project: IProject;
}

const PageProjectEdit: React.FC<IProps> = ({ project }) => {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [contacts, setContacts] = useState<IContact[]>(
        project?.contacts ?? []
    );
    const [showContactModal, setShowContactModal] = useState<boolean>(false);
    const [contactModal, setContactModal] = useState<IContact | null>(null);

    const formRef = useRef<any>();
    const [formError, setFormError] = useState({});
    const [formValue, setFormValue] = useState({
        name: project.name,
        description: project.description,
        status: project.status,
    });

    const handleSubmit = () => {
        if (!formRef.current.check()) {
            return;
        }

        setLoading(true);
        HttpClient({
            url: `/api/project/${project.id}`,
            method: "post",
            data: {
                name: formValue.name,
                description: formValue.description,
                status: formValue.status,
            },
        })
            .then(() => {
                window.addNotification("success", "Sikeres mentés");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteContact = (contact: IContact) => {
        setLoading(true);
        HttpClient({
            url: `/api/contact/${project.id}/${contact.id}`,
            method: "delete",
        })
            .then((res: any) => {
                window.addNotification("success", "Sikeres törlés");
                setContacts(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <PageWrapper>
            <Grid>
                <Row style={{ marginBottom: 30 }}>
                    <Col md={24}>
                        <h1 style={{ padding: "40px 0" }}>{project.name}</h1>

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

                            <ButtonToolbar>
                                <Button
                                    appearance="link"
                                    color="red"
                                    onClick={() => setShowDeleteModal(true)}
                                    loading={loading}
                                >
                                    Törlés
                                </Button>
                                <Button
                                    appearance="primary"
                                    onClick={handleSubmit}
                                    loading={loading}
                                >
                                    Mentés
                                </Button>
                            </ButtonToolbar>
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
                    </Col>
                </Row>
            </Grid>
            <ModalContact
                project={project}
                contact={contactModal}
                open={showContactModal}
                onClose={() => {
                    setShowContactModal(false);
                    setContactModal(null);
                }}
                onSave={(contacts: IContact[], isCreate: boolean) => {
                    setContacts(contacts);
                }}
            />
            <Modal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            >
                <Modal.Header>
                    <Modal.Title>Törlés</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Biztosan törölni szeretné ezt a projektet?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            if (!showDeleteModal) {
                                return;
                            }
                            setLoading(true);
                            HttpClient({
                                url: `/api/project/${project.id}`,
                                method: "delete",
                            }).finally(() => {
                                window.location.href = "/";
                            });
                        }}
                        appearance="primary"
                        color="red"
                        loading={loading}
                    >
                        Törlés
                    </Button>
                    <Button
                        onClick={() => setShowDeleteModal(false)}
                        appearance="subtle"
                        loading={loading}
                    >
                        Mégse
                    </Button>
                </Modal.Footer>
            </Modal>
        </PageWrapper>
    );
};
export default PageProjectEdit;
