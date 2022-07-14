function add_sdgs_input(index) {
  // Format index
  var index = ("0" + index).slice(-2);

  // Get container
  var obj_sdgs_container = document.getElementById("sdgs_container");

  // Create SDGs element
  // <div class="d-flex mt-2">
  var obj_div = document.createElement("div");
  obj_div.className = "d-flex mt-2";

  // Create image
  // <img src="/static/imgs/SDGs_11.jpg" alt="" style="width:60px">
  var img = document.createElement("img");
  img.src = "/static/imgs/SDGs_" + index + ".jpg";
  img.setAttribute("width", "60px");
  img.setAttribute("height", "60px");

  // Create input
  // <textarea class="form-control ml-3" placeholder="填寫符合此指標的執行方式" style="resize: none"></textarea>
  var obj_textarea = document.createElement("textarea");
  obj_textarea.id = "sdg_" + index + "_des";
  obj_textarea.className = "form-control ml-3";
  obj_textarea.placeholder = "填寫符合此指標的執行方式";
  obj_textarea.style = "resize: none";

  // Append
  obj_div.appendChild(img);
  obj_div.appendChild(obj_textarea);
  obj_sdgs_container.append(obj_div);
}

function add_social_impact_chkbox() {
  // Load social impact items
  var cms_plan_list_sdg = getLocalStorage("cms_plan_list_sdg");
  var list_cms_plan_list_sdg = cms_plan_list_sdg.split(",");

  for (var index = 0 ; index <17; index++) {
    if (list_cms_plan_list_sdg[index] == "1") {
      add_sdgs_input(index + 1);
    }
  }
}

function set_page_info() {
  // Get path
  var path = window.location.pathname;
  var page = path.split("/").pop();

  if (page == "cms_impact.html") {
    add_social_impact_chkbox();
  }
}

