import Joi from "joi";

export const mediaValidator = Joi.alternatives().try(
  Joi.object({
    hapi: Joi.object({
      filename: Joi.string().required(),
      headers: Joi.object({
        "content-type": Joi.string()
          .valid(
            "image/jpeg",
            "image/png",
            "image/gif",
            "video/mp4",
            "video/webm",
            "video/avi",
            "audio/mp3",
            "audio/wav",
            "font/woff",
            "font/woff2",
            "application/epub+zip", // EPUB format
            "application/pdf", // PDF format
            "application/x-mobipocket-ebook", // MOBI format
            "application/x-amazon-azw", // AZW format
            "application/x-amazon-azw3", // AZW3 format
            "application/fb2+xml", // FB2 format
            "application/x-ms-reader", // LIT format
            "application/x-ibooks+zip", // iBooks format
            "application/vnd.comicbook+zip", // CBR format
            "application/vnd.comicbook-rar", // CBZ format
            "application/x-djvu" // DJVU format
          )
          .required(),
      }).unknown(true),
    })
      .required()
      .unknown(true),
  }).unknown(true),
  Joi.array()
    .items(
      Joi.object({
        hapi: Joi.object({
          filename: Joi.string().required(),
          headers: Joi.object({
            "content-type": Joi.string()
              .valid(
                "image/jpeg",
                "image/png",
                "image/gif",
                "video/mp4",
                "video/webm",
                "video/avi",
                "audio/mp3",
                "audio/wav",
                "font/woff",
                "font/woff2",
                "application/epub+zip", // EPUB format
                "application/pdf", // PDF format
                "application/x-mobipocket-ebook", // MOBI format
                "application/x-amazon-azw", // AZW format
                "application/x-amazon-azw3", // AZW3 format
                "application/fb2+xml", // FB2 format
                "application/x-ms-reader", // LIT format
                "application/x-ibooks+zip", // iBooks format
                "application/vnd.comicbook+zip", // CBR format
                "application/vnd.comicbook-rar", // CBZ format
                "application/x-djvu" // DJVU format
              )
              .required(),
          }).unknown(true),
        })
          .required()
          .unknown(true),
      }).unknown(true)
    )
    .optional()
);
