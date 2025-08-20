export const baseUrlNode = "http://localhost:8080/api"; // Base URL cho backend Node.js

const APINode = {
    // MoMo APIs
    createMoMoPayment: () => `${baseUrlNode}/momo/create-payment`,
    momoNotify: () => `${baseUrlNode}/momo/notify`,
    momoReturn: () => `${baseUrlNode}/momo/return`,
    createBillMoMo: (transId) => `${baseUrlNode}/bill/create-bill-client-momo/${transId}`,
    // COD API (nếu cần)
    createBillClient: () => `${baseUrlNode}/bill/create-bill-client`,
};

export default APINode;