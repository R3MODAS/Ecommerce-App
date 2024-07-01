import joi from "joi";

export const createProductReviewSchema = joi.object({
    rating: joi.number().required(),
    comment: joi.string().required().trim(),
});
