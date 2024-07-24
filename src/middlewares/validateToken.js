export const authRequired = (req, res, next) => {
    console.log('validing token');
    next();
};