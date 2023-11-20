import React, { forwardRef, useRef, useState } from "react";
import {
    Button,
    ButtonToolbar,
    Col,
    Form,
    Grid,
    Input,
    InputNumber,
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

const { StringType, NumberType, ArrayType, ObjectType } = Schema.Types;
const model = Schema.Model({
    name: StringType().isRequired("Kötelező mező"),
    description: StringType().isRequired("Kötelező mező"),
    status: NumberType("Nem megfelelő státusz")
        .range(0, 2, "Kérem válasszon érvényes státuszt.")
        .isRequired("Kötelező mező"),
    contacts: ArrayType().of(
        ObjectType().shape({
            name: StringType().isRequired("Kötelező mező"),
            email: StringType()
                .isRequired("Kötelező mező")
                .isEmail("Nem érvényes e-mail formátum"),
        })
    ),
});

interface IProps {
    project: IProject;
}

const PageProject: React.FC<IProps> = ({ project }) => {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    /*const [contacts, setContacts] = useState<IContact[]>(
        project?.contacts ?? []
    );
    const [showContactModal, setShowContactModal] = useState<boolean>(false);
    const [contactModal, setContactModal] = useState<IContact | null>(null);*/

    const formRef = useRef<any>();
    const [formError, setFormError] = useState({});
    const [formValue, setFormValue] = useState({
        name: project.name,
        description: project.description,
        status: project.status,
        contacts: project.contacts.map((c) => ({
            name: c.name,
            email: c.email,
        })),
    });

    const handleSubmit = () => {
        if (!formRef.current.check()) {
            return;
        }

        // console.log(formValue);
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

    return (
        <PageWrapper>
            <Grid>
                <Row>
                    <Col md={24}>
                        <h1 style={{ padding: "40px 0" }}>{project.name}</h1>

                        <Form
                            ref={formRef}
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

                            {JSON.stringify(project.contacts)}
                            {/*
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
                            */}

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
            </Grid>

            {/*
            <ModalContact
                contact={contactModal}
                open={showContactModal}
                onClose={() => {
                    setShowContactModal(false);
                    setContactModal(null);
                }}
                onSave={function (contact: IContact, isCreate: boolean): void {
                    throw new Error("Function not implemented.");
                }}
            />
            */}
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
export default PageProject;

export const Cell = ({ children, style, ...rest }: any) => (
    <td
        style={{ padding: "2px 4px 2px 0", verticalAlign: "top", ...style }}
        {...rest}
    >
        {children}
    </td>
);

export const ContactItem = ({
    rowValue = {},
    onChange,
    rowIndex,
    rowError,
}: any) => {
    const handleChangeName = (value) => {
        onChange(rowIndex, { ...rowValue, name: value });
    };
    const handleChangeAmount = (value) => {
        onChange(rowIndex, { ...rowValue, quantity: value });
    };

    return (
        <tr>
            <Cell>
                <Input
                    value={rowValue.name}
                    onChange={handleChangeName}
                    style={{ width: 196 }}
                />
                {rowError ? (
                    <ErrorMessage>{rowError.name.errorMessage}</ErrorMessage>
                ) : null}
            </Cell>
            <Cell>
                <InputNumber
                    min={0}
                    value={rowValue.quantity}
                    onChange={handleChangeAmount}
                    style={{ width: 100 }}
                />
                {rowError ? (
                    <ErrorMessage>
                        {rowError.quantity.errorMessage}
                    </ErrorMessage>
                ) : null}
            </Cell>
        </tr>
    );
};

const ErrorMessage = ({ children }) => (
    <span style={{ color: "red" }}>{children}</span>
);
