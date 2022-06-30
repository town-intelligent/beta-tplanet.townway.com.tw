const ab_project_submit_pages = ["ab_plan_info.html", "ab_project_planning.html", "ab_sdgs_setting.html", "ab_contact_person.html"];

function plan_submit() {
  // Check required field and save to JSON struct
  var dataJSON = {};
  dataJSON.email = getLocalStorage("email"); 
  dataJSON.name = getLocalStorage("ab_project_name");
  dataJSON.business_philosophy = getLocalStorage("ab_project_business_philosophy");
  dataJSON.project_start_date = getLocalStorage("ab_project_project_start_date");
  dataJSON.project_due_date = getLocalStorage("ab_project_project_due_date");
  dataJSON.budget = getLocalStorage("ab_project_budget");
  dataJSON.relate_people = getLocalStorage("ab_project_relate_people");
  dataJSON.list_project_type = getLocalStorage("ab_project_list_project_type");
  dataJSON.motivation = getLocalStorage("ab_project_motivation");
  dataJSON.project_planning = getLocalStorage("ab_project_project_planning");
  dataJSON.list_sdg = getLocalStorage("ab_project_list_sdg");
  dataJSON.list_sr = getLocalStorage("ab_project_list_sr");
  dataJSON.project_hoster = getLocalStorage("ab_project_hoster");
  dataJSON.hoster_email = getLocalStorage("ab_project_email");
  dataJSON.org = getLocalStorage("ab_project_org");
  dataJSON.tel = getLocalStorage("ab_project_tel");
  dataJSON.list_location = getLocalStorage("ab_project_list_location");
  
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

function set_local_storage(page) {
  if (page == "ab_plan_info.html") {
    // Get data
    var name = document.getElementById("name").value;
    var business_philosophy = document.getElementById("business_philosophy").value;
    var project_start_date = document.getElementById("project_start_date").value;
    var project_due_date = document.getElementById("project_due_date").value;
    var budget = document.getElementById("budget").value;
    var relate_people = document.getElementById("relate_people").value;

    // Set local storage
    setLocalStorage("ab_project_name", name);
    setLocalStorage("ab_project_business_philosophy", business_philosophy);
    setLocalStorage("ab_project_project_start_date", project_start_date);
    setLocalStorage("ab_project_project_due_date", project_due_date);
    setLocalStorage("ab_project_budget", budget);
    setLocalStorage("ab_project_relate_people", relate_people); 
  }

  if (page == "ab_project_planning.html") {
    // Get data
    var list_project_type = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    for(var index = 1; index <= 9; index++) {
      if (document.getElementById("project_type_" + index.toString()).checked.toString() == "true") {
        list_project_type[index - 1] = 1;
      }
    }
    var motivation = document.getElementById("motivation").value;
    var project_planning = document.getElementById("project_planning").value;

    // Set local storage
    setLocalStorage("ab_project_list_project_type", list_project_type);
    setLocalStorage("ab_project_motivation", motivation);
    setLocalStorage("ab_project_project_planning", project_planning);
  }

  if (page == "ab_sdgs_setting.html") {
    // Get data
    var list_sdg = new Array(17).fill(0);
    
    for(var index = 1; index <= 17; index++) {
      if (document.getElementById("sdg_" + index.toString()).checked.toString() == "true") {
        list_sdg[index - 1] = 1;
      }
    }

    var list_sr = [0, 0, 0]
    
    for(var index = 1; index <= 3; index++) {
      if (document.getElementById("sr_" + index.toString()).checked.toString() == "true") {
        list_sr[index - 1] = 1;
      }
    }

    // Set local storage
    setLocalStorage("ab_project_list_sdg", list_sdg);
    setLocalStorage("ab_project_list_sr", list_sr);
  }

  if (page == "ab_contact_person.html") {
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
    setLocalStorage("ab_project_hoster", hoster);
    setLocalStorage("ab_project_email", email);
    setLocalStorage("ab_project_org", org);
    setLocalStorage("ab_project_tel", tel);
    setLocalStorage("ab_project_list_location", list_location);
  }
}

function get_page_index(page) {
  for (var index = 0; index < ab_project_submit_pages.length; index++) {
    if (page == ab_project_submit_pages[index])
	  return index
  }
  return null
}

function get_index_page(index) {
  return ab_project_submit_pages[index];
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
    if (index < ab_project_submit_pages.length - 1) {
      var next_page = get_index_page(index + 1);
      window.location.replace("/backend/" + next_page);
    } else {
      window.location.replace("/backend/" + get_index_page(ab_project_submit_pages.length - 1));
    }

    // Submit
    if (page == "ab_contact_person.html") {
      if (uuid = plan_submit()) {
        window.location.replace("/backend/ab_cms_project_detail.html?uuid=" + uuid); 
      }
    }
  });
});
