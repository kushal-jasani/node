exports.getNotFound=(req, res, next) => {
    res.status(404).render("404", { pagetitle: "not found",path:''});
}