import { toast } from 'react-toastify';

const toastConfigError = {
    position: 'bottom-left',
    autoClose: 2000,
    pauseOnHover: true,
    draggable: false,
    theme: 'dark',
};

const toastConfigSuccess = {
    position: 'top-center',
    autoClose: 2000,
    pauseOnHover: true,
    draggable: false,
    theme: 'light',
};

export const toastError = (message) => {
    toast.error(message, toastConfigError);
};

export const toastSuccess = (message) => {
    toast.success(message, toastConfigSuccess);
};