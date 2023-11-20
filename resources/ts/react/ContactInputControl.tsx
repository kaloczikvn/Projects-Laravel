import React from "react";
import { ButtonGroup, IconButton } from "rsuite";
import { Cell, ContactItem } from "./PageProject";

const ContactInputControl = ({ value = [], onChange, fieldError }) => {
    const errors = fieldError ? fieldError.array : [];
    const [contacts, setContacts] = React.useState(value);
    const handleChangeContacts = (nextContacts) => {
        setContacts(nextContacts);
        onChange(nextContacts);
    };
    const handleInputChange = (rowIndex: any, value: any) => {
        const nextContacts = [...contacts];
        nextContacts[rowIndex] = value;
        handleChangeContacts(nextContacts);
    };

    const handleMinus = () => {
        handleChangeContacts(contacts.slice(0, -1));
    };
    const handleAdd = () => {
        handleChangeContacts(contacts.concat([{ name: "", email: "" }]));
    };

    return (
        <table>
            <thead>
                <tr>
                    <Cell>Contact Name</Cell>
                    <Cell>Quantity</Cell>
                </tr>
            </thead>
            <tbody>
                {contacts.map((rowValue, index) => (
                    <ContactItem
                        key={index}
                        rowIndex={index}
                        rowValue={rowValue}
                        rowError={errors[index] ? errors[index].object : null}
                        onChange={handleInputChange}
                    />
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <Cell colSpan={2} style={{ paddingTop: 10 }}>
                        <ButtonGroup size="xs">
                            <IconButton
                                onClick={handleAdd}
                                icon={<PlusIcon />}
                            />
                            <IconButton
                                onClick={handleMinus}
                                icon={<MinusIcon />}
                            />
                        </ButtonGroup>
                    </Cell>
                </tr>
            </tfoot>
        </table>
    );
};
