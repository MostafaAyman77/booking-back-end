const path = require("path");
const fs = require("fs");

// GET /api/lang/:lang
// exports.getLanguage = (req, res, next) => {
//   const { lang } = req.params;
//   const filePath = path.join("../Controllers/langController.js", `../locales/${lang}.json`);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({
//       status: "fail",
//       message: `Language '${lang}' not supported`,
//     });
//   }

//   const translations = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//   res.json({
//     status: "success",
//     language: lang,
//     data: translations,
//   });
// };

exports.getLanguage = (req, res, next) => {
  const { lang } = req.query; 
  const filePath = path.join(__dirname, `../locales/${lang}.json`);

  if (!lang) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a lang parameter (e.g. ?lang=en)"
    });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "fail",
      message: `Language '${lang}' not supported`
    });
  }

  try {
    const translations = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json({
      status: "success",
      language: lang,
      data: translations
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Error parsing ${lang}.json`
    });
  }
};

exports.getAllLanguages = (req, res, next) => {
  const languages = ["en", "fr", "ar"];
  const translations = {};

  languages.forEach((lang) => {
    const filePath = path.join(__dirname, `../locales/${lang}.json`);

    if (fs.existsSync(filePath)) {
      translations[lang] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } else {
      translations[lang] = {}; 
    }
  });

  res.json({
    status: "success",
    data: translations,
  });
};


// UPDATE /api/lang?lang=en
exports.updateLanguage = (req, res) => {
  const { lang } = req.query;
  const updates = req.body;
  const filePath = path.join(__dirname, `../locales/${lang}.json`);

  if (!lang) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a lang parameter (e.g. ?lang=en)",
    });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "fail",
      message: `Language '${lang}' not found`,
    });
  }

  try {
    const currentData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const updatedData = { ...currentData, ...updates };
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf-8");

    res.json({
      status: "success",
      message: `Language '${lang}' updated successfully`,
      data: updatedData,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Error updating ${lang}.json`,
    });
  }
};

