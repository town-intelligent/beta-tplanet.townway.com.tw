const cms_project_submit_pages = ["cms_plan_info.html", "cms_sdgs_setting.html", "cms_impact.html", "cms_contact_person.html"];
const cms_support_format = ["cms_missions_display.html", "cms_support_form.html", "cms_deep_participation.html"]

function task_submit(uuid) {
  var list_target_sdgs = JSON.parse(getLocalStorage("list_target_sdgs"));

  // {'uuid': '92101343', 'tasks[0][sdg]': '01', 'tasks[0][des]': '11', 'tasks[1][sdg]': '02', 'tasks[1][des]': '22'}
  var dataJSON = {};
  dataJSON.email = getLocalStorage("email");
  dataJSON.uuid = uuid;
  dataJSON.tasks = [];
  for (var index = 0; index < list_target_sdgs.length; index++) {
    var obj = JSON.parse(list_target_sdgs[index]);
    dataJSON.tasks.push(obj);
    // dataJSON.push(list_target_sdgs[index]);
  }

  alert(JSON.stringify(dataJSON));  
  
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/new",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       // dataJSON.uuid = obj.uuid;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return "dataJSON.uuid";
}

function plan_submit(uuid = null) {
  // Check required field and save to JSON struct
  var dataJSON = {};

  if (uuid != null) {
    dataJSON.uuid = uuid
  }

  dataJSON.email = getLocalStorage("email");
  dataJSON.name = getLocalStorage("cms_plan_name");
  dataJSON.project_a = getLocalStorage("cms_plan_project_a");
  dataJSON.project_b = getLocalStorage("cms_plan_project_b");
  dataJSON.project_start_date = getLocalStorage("cms_plan_start_date");
  dataJSON.project_due_date = getLocalStorage("cms_plan_due_date");
  dataJSON.budget = getLocalStorage("cms_plan__budget");
  dataJSON.philosophy = getLocalStorage("cms_plan_philosophy");
  dataJSON.list_sdg = getLocalStorage("cms_plan_list_sdg");
  dataJSON.weight_description = getLocalStorage("weight_description");
  dataJSON.hoster_email = getLocalStorage("cms_plan_email");
  dataJSON.hoster = getLocalStorage("cms_plan_hoster");
  dataJSON.org = getLocalStorage("cms_plan_org");
  dataJSON.tel = getLocalStorage("cms_plan_tel");
  dataJSON.list_location = getLocalStorage("cms_plan_list_location");

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/projects/upload",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       dataJSON.uuid = obj.uuid;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return dataJSON.uuid;
}

function set_local_storage(page){
  if (page == "cms_plan_info.html") {
    // Get data
    var name = document.getElementById("name").value;
    var project_a = document.getElementById("project_a").value;
    var project_b = document.getElementById("project_b").value;
    var project_start_date = document.getElementById("project_start_date").value;
    var project_due_date = document.getElementById("project_due_date").value;
    var budget = document.getElementById("budget").value;
    var philosophy = document.getElementById("philosophy").value;

    // Set local storage
    setLocalStorage("cms_plan_name", name); 
    setLocalStorage("cms_plan_project_a", project_a); 
    setLocalStorage("cms_plan_project_b", project_b);
    setLocalStorage("cms_plan_project_start_date", project_start_date); 
    setLocalStorage("cms_plan_project_due_date", project_due_date); 
    setLocalStorage("cms_plan_budget", budget); 
    setLocalStorage("cms_plan_philosophy", philosophy); 
  }

  if (page == "cms_sdgs_setting.html") {
    // Get data
    var list_sdg = new Array(17).fill(0);
    for(var index = 1; index <= 17; index++) {
      if (document.getElementById("sdg_" + index.toString()).checked.toString() == "true") {
        list_sdg[index - 1] = 1;
      }
    }

    // Set local storage
    setLocalStorage("cms_plan_list_sdg", list_sdg);
  }

  if (page == "cms_impact.html") {
    // Load social impact items and save to local storage
    var cms_plan_list_sdg = getLocalStorage("cms_plan_list_sdg");
    var list_cms_plan_list_sdg = cms_plan_list_sdg.split(",");

    var dataJSON = {};
    for (var index = 0 ; index <17; index++) {
      if (list_cms_plan_list_sdg[index] == "1") {

	// Append to JSON 
	dataJSON[index] = document.getElementById("sdg_" + ("0" + (index + 1)).slice(-2) + "_des").value;
      }
    }

    // Set to localstorage
    setLocalStorage("weight_description", JSON.stringify(dataJSON));
  }

  if (page == "cms_support_form.html") {
    var list_target_sdgs = [];
    var list_tasks = [];
    // Get list_sdgs
    if (getLocalStorage("list_target_sdgs") != "") {
      list_target_sdgs = getLocalStorage("list_target_sdgs").split(",");
    }

    for (var index = 0; index < list_target_sdgs.length; index ++) {
      // Get SDGs tasks
      var dataJSON = {}; 
      dataJSON.sdg = list_target_sdgs[index].toString();
      dataJSON.des = document.getElementById("target_sdgs_" + list_target_sdgs[index].toString()).value;
      list_tasks.push(JSON.stringify(dataJSON));
      setLocalStorage("list_target_sdgs", JSON.stringify(list_tasks));
    }
  }

  if (page == "cms_contact_person.html") {
    // Get data
    var hoster = document.getElementById("hoster").value;
    var email = document.getElementById("email").value;
    var org = document.getElementById("org").value;
    var tel = document.getElementById("tel").value;
    var list_location = [0, 0, 0, 0, 0];
    for(var index = 1; index <= 5; index++) {
      if (document.getElementById("location_" + index.toString()).checked.toString() == "true") {
        list_location[index - 1] = 1;
      }
    }

    // Set local storage
    setLocalStorage("cms_plan_hoster", hoster);
    setLocalStorage("cms_plan_email", email);
    setLocalStorage("cms_plan_org", org);
    setLocalStorage("cms_plan_tel", tel);
    setLocalStorage("cms_plan_list_location", list_location);
  }
}

$(function () {
  $("#add_c_project").on("click", function(event) {
    event.preventDefault();
    window.location.replace("/backend/cms_plan_info.html"); 
  });
});

function get_page_index(page) {
  // FIXME: Hard coding for cms_support_format
  for (var index = 0; index < cms_support_format.length; index++) {
    if (page == cms_support_format[index]) {
	  return 1
    }
  }
  
  for (var index = 0; index < cms_project_submit_pages.length; index++) {
    if (page == cms_project_submit_pages[index])
          return index
  }
  return null
}

function get_index_page(index) {
  return cms_project_submit_pages[index];
}

// Previous page
$(function () {
  $("#btn_ab_project_prev").on("click", function(e) {
    e.preventDefault(); // To prevent following the link (optional)

    // Get path
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Get index
    var index = get_page_index(page);

    // Replace page
    if (index > 0)
      window.location.replace(get_index_page(index - 1));
    else
      window.location.replace(get_index_page(0));
  });
});

// Submit to next page
$(function () {
  $("form").on("submit", function(e){
    e.preventDefault();

    // Get path
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Set local storage
    set_local_storage(page);

    // Get index
    var index = get_page_index(page);

    // Replace page
    if (index < cms_project_submit_pages.length - 1) {
      var next_page = get_index_page(index + 1);
      window.location.replace("/backend/" + next_page);
    } else {
      window.location.replace("/backend/" + get_index_page(cms_project_submit_pages.length - 1));
    }

    // Submit
    if (page == "cms_contact_person.html") {
      var uuid_project = null;
      if (getLocalStorage("uuid_project") != "") {
        uuid_project = getLocalStorage("uuid_project");
      }

      if (uuid = plan_submit(uuid_project)) {
        // TODO: Task submit
	task_submit(uuid_project);

         // FIXME: Redirect
         // window.location.replace("/backend/cms_project_detail.html?uuid=" + uuid);
       }
    }
  });
});

$(function () {
  $("#btn_cms_plan_save").on("click", function(e) {
    e.preventDefault(); // To prevent following the link (optional)

    // Get path
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Set localstorage
    set_local_storage(page)

    // Submit
    var uuid_project = null;
    if (getLocalStorage("uuid_project") != "") {
      uuid_project = getLocalStorage("uuid_project");
    }

    var uuid = plan_submit(uuid_project);
    setLocalStorage("uuid_project", uuid);

    alert("儲存成功");
  });
});

$(function () {
  $("#btn_cms_plan_preview").on("click", function(e) {
    e.preventDefault(); // To prevent following the link (optional)

    // Get path
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Set localstorage
    set_local_storage(page)

    // Submit
    var uuid_project = null;
    if (getLocalStorage("uuid_project") != "") {
      uuid_project = getLocalStorage("uuid_project");
    }

    var uuid = plan_submit(uuid_project);
    setLocalStorage("uuid_project", uuid);

    // New preview window
    window.open("/backend/cms_project_detail.html?uuid=" + uuid);
  });
});

$(function () {
  $("#btn_cms_plan_add_parent_tasks").on("click", function(e) {
    e.preventDefault(); // To prevent following the link (optional)

    // Get path
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Set localstorage
    set_local_storage(page)

    // Submit
    var uuid_project = null;
    if (getLocalStorage("uuid_project") != "") {
      uuid_project = getLocalStorage("uuid_project");
    }

    var uuid = plan_submit(uuid_project);
    setLocalStorage("uuid_project", uuid);

    // Redirect to add parent window
    window.location.replace("/backend/cms_missions_display.html?uuid=" + uuid);
  });
});

// btn_cms_plan_add_form_task
$(function () {
  $("#btn_cms_plan_add_form_task").on("click", function(e) {
    e.preventDefault(); // To prevent following the link (optional)

    // Get path
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Set localstorage
    set_local_storage(page)

    // Submit
    var uuid_project = null;
    if (getLocalStorage("uuid_project") != "") {
      uuid_project = getLocalStorage("uuid_project");
    }

    var uuid = plan_submit(uuid_project);
    setLocalStorage("uuid_project", uuid);

    // Redirect to add parent window
    window.location.replace("/backend/cms_support_form.html?uuid=" + uuid);
  });
});

// btn sdg trigger
$(function () {
  $("[id='btn_sdg']").on("click", function(e) {
    e.stopPropagation();
    var obj_name = $(this).attr("name");

    // var obj_name = ("0" + index).slice(-2);

    for(var index = 1; index <= 17; index++) {
      var index_sdg = "";
      if (index  < 10) {
        index_sdg = ("0" + index).slice(-2);
      } else {
        index_sdg = index;
      }

      document.getElementsByName(index_sdg.toString())[0].style.backgroundColor = "";
    }

    // Set task sdgs
    document.getElementsByName(obj_name)[0].style.backgroundColor = "gray";
    setLocalStorage("target_sdgs", obj_name);
  });
});

// btn_add_sdg_into_task
$(function () {
  $("#btn_add_sdg_into_task").on("click", function(e) {
    e.stopPropagation();

    var list_target_sdgs = [];
    if (getLocalStorage("list_target_sdgs") != "") {
      list_target_sdgs = getLocalStorage("list_target_sdgs").split(",");
    }
    list_target_sdgs.push(getLocalStorage("target_sdgs"));
    setLocalStorage("list_target_sdgs", list_target_sdgs);

    // Show widget
    var obj_sdgs_container = document.getElementById("sdgs_container");

    // Create SDGs element - row
    // <div class="row align-items-center justify-content-center mt-4">
    var obj_div_row = document.createElement("div");
    obj_div_row.className = "row align-items-center justify-content-center mt-4";

    // Create image
    // <img class="col-3 col-md-1" src="/static/imgs/SDGs_04.jpg" alt="">
    var obj_img = document.createElement("img");
    obj_img.className = "col-3 col-md-1";
    obj_img.src = "/static/imgs/SDGs_" + getLocalStorage("target_sdgs") + ".jpg";
    obj_img.setAttribute("width", "49px");
    obj_img.setAttribute("height", "49px");

    // Create label
    // <label class="col-3 col-md-1 col-form-label pr-0">支持，</label>
    var obj_label = document.createElement("label");
    obj_label.className = "col-3 col-md-1 col-form-label pr-0";
    obj_label.innerHTML = "支持，";

    // Create div_child
    // <div class="mt-3 mt-md-0 col-md-10 pl-md-0">
    var obj_div_child = document.createElement("div");
    obj_div_child.className = "mt-3 mt-md-0 col-md-10 pl-md-0";

    // Create input
    // <input type="text" class="form-control" placeholder="SDG 15 陸地生態保育，請留下您的支持評論。">
    var obj_input = document.createElement("input");
    obj_input.id = "target_sdgs_" + getLocalStorage("target_sdgs");
    obj_input.type = "text";
    obj_input.className = "form-control";
    obj_input.placeholder = "請留下您的支持評論。"

    // Append
    obj_div_child.append(obj_input);
    
    obj_div_row.append(obj_img);
    obj_div_row.append(obj_label);
    obj_div_row.append(obj_div_child);
    obj_sdgs_container.append(obj_div_row);

    // Finish
    $("#SDGsModal").modal("hide");
  });
});

