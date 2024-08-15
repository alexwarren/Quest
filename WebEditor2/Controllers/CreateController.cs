using Microsoft.AspNetCore.Mvc;
using WebEditor2.Services;

namespace WebEditor2.Controllers
{
    public class CreateController(EditorService editorService) : Controller
    {
        //
        // GET: /Create/

        public ActionResult Index()
        {
            return RedirectToAction("New");
        }

        public ActionResult New()
        {
            return View(EditorService.GetCreateModel(TemplateFolder));
        }

        [HttpPost]
        public ActionResult New(Models.Create createModel)
        {
            EditorService.PopulateCreateModelLists(createModel, TemplateFolder);
            if (ModelState.IsValid)
            {
                int newId = editorService.CreateNewGame(createModel.SelectedType,
                    createModel.SelectedTemplate,
                    createModel.GameName,
                    TemplateFolder);
                return View("CreateSuccess", new Models.CreateSuccess { Id = newId, Name = createModel.GameName });
            }
            else
            {
                return View(createModel);
            }
        }

        private string TemplateFolder
        {
            // TODO
            // get { return Server.MapPath("~/bin/Core/Templates/"); }

            get { return null; }
        }
    }
}
