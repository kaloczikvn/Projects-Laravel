import Axios from 'axios';

export const HttpClient = ({
    method = 'get',
    url = '',
    data = {},
    params = {},
    timeout = 30000,
    additionalHeaders = {},
    contentType = 'application/json',
    cancelToken = undefined,
}: any) => {
    let headers = {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        Accept: 'application/json, text/plain',
        ...additionalHeaders,
    };

    if (contentType === 'multipart/form-data' && data instanceof FormData == false) {
        data = jsonToFormData(data);
    }

    return Axios({
        url: url,
        method,
        timeout,
        headers,
        data,
        params,
        cancelToken,
    });
};

function buildFormData(formData: any, data: any, parentKey?: any) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach((key) => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : data;
        formData.append(parentKey, value);
    }
}

function jsonToFormData(data: any) {
    const formData = new FormData();
    buildFormData(formData, data);
    return formData;
}

export default HttpClient;
