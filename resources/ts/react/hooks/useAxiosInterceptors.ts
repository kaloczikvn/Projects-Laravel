import Axios from "axios";

let registered = false;
export const useAxiosInterceptors = () => {
    if (!registered) {
        registered = true;
        Axios.interceptors.response.use(
            (response: any) => {
                return response;
            },
            (err: any) => {
                console.error(err);

                if (Axios.isCancel(err) || err.code == "ERR_CANCELED") {
                    return err;
                }

                if (err.code === "ECONNABORTED") {
                    window.addNotification(
                        "error",
                        "Megszakadt a kapcsolat a szerverrel! Megszűnt az internet kapcsolat vagy a kérés túl sokáig futott?"
                    );
                    return err;
                }

                const errors = err?.response?.data?.errors
                    ? err.response.data.errors
                    : null;
                const message = err?.response?.data?.message
                    ? err.response.data.message
                    : null;

                if (errors !== null) {
                    for (const errorKey of Object.keys(errors)) {
                        window.addNotification("error", errors[errorKey][0]);
                    }
                }

                if (message !== null) {
                    window.addNotification("error", message);
                }

                return Promise.reject(err);
            }
        );
    }
};
