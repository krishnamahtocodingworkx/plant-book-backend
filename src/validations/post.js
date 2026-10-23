import Joi from "joi";

export const createPostSchema = Joi.object({
  content: Joi.string().trim().max(5000).allow("").optional(),

  media: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().trim().uri().required(),
        type: Joi.string().valid("image", "video").required(),
      }),
    )
    .optional(),
})
  .custom((value, helpers) => {
    const hasContent = Boolean(value.content?.trim());
    const hasMedia = Boolean(value.media?.length);

    if (!hasContent && !hasMedia) {
      return helpers.error("any.invalid");
    }

    return value;
  })
  .messages({
    "any.invalid": "A post must contain text or at least one media item.",
  });

export const getProfilePostQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),
});
