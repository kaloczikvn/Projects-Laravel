import React from "react";
import { CustomProvider, Message, useToaster } from "rsuite";
import { MessageType } from "rsuite/esm/Notification/Notification";
import { huHU } from "rsuite/esm/locales";
import "rsuite/styles/index.less";
import { useAxiosInterceptors } from "../hooks/useAxiosInterceptors";

interface IProps {
    children?: any;
    className?: string;
}

const PageWrapper: React.FC<IProps> = ({ children, className }) => {
    if (!window.addNotification) {
        const toaster = useToaster();
        window.addNotification = (type: MessageType, message: any) => {
            toaster.push(
                <Message showIcon type={type} closable>
                    {message && <>{message}</>}
                </Message>,
                {
                    placement: "topEnd",
                    duration:
                        type === "warning" || type === "error" ? 0 : 10000,
                }
            );
        };
        useAxiosInterceptors();
    }

    return (
        <div className={className ?? ""}>
            <CustomProvider locale={huHU} theme="dark">
                {children ?? null}
            </CustomProvider>
        </div>
    );
};
export default PageWrapper;

declare global {
    interface Window {
        addNotification: (type: MessageType, message: any) => void;
    }
}
