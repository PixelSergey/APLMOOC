var client_id = "50c4648f34bb075578c383ec62d6908fa49b6986d992c34a2a029be777e0337e";
var client_secret = "d15d4d4ba2b80a91aaff7a5c94d30fe65c87b058991a327a5de4dfe71f7c5576";
var mooc_status = 0;
var mooc_token;

$=s=>document.querySelector(s);
$$=s=>document.querySelectorAll(s);


// On page load

if("mooc_token" in sessionStorage) {
    mooc_token = sessionStorage.getItem("mooc_token");

    if($$("div.write-problem").length > 0) {
        problem_status_update();
    }
}


// Authentication

function login() {
    let user = $("#user").value;
    let pass = $("#pass").value;
    let ret = mooc_login(user, pass, logincallback);
    console.log(ret);
    $("#loginResponse").innerHTML = "Logging in...";
}

function mooc_login(username,password,callback) {
    var xhttp = new XMLHttpRequest();
    var client_id = "50c4648f34bb075578c383ec62d6908fa49b6986d992c34a2a029be777e0337e";
    var client_secret = "d15d4d4ba2b80a91aaff7a5c94d30fe65c87b058991a327a5de4dfe71f7c5576";
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            mooc_status = this.status == 200 ? 1 : 2;
            if (mooc_status == 1) {
                mooc_token = JSON.parse(this.responseText)["access_token"];
                sessionStorage.setItem("mooc_token",mooc_token);
                $("#loginResponse").innerHTML = "Success";
            } else {
                $("#loginResponse").innerHTML = "Login failed";
            }
            callback();
        }
    }
    xhttp.open("POST","https://tmc.mooc.fi/oauth/token",true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("client_id="+client_id+"&"+
               "client_secret="+client_secret+"&"+
               "username="+encodeURIComponent(username)+"&"+
               "password="+encodeURIComponent(password)+"&"+
               "grant_type=password");
}

function mooc_logout(callback) {
    mooc_status = 0;
    mooc_token = "";
    sessionStorage.clear();
    callback();
}


// Problem status

function problem_status() {
    console.log(`Getting problem status for user ${mooc_token}`);
    // Return dummy data
    return ["c1_p1", "c1_p3"];
}

function problem_status_update() {
    const solved = problem_status();
    let problems = $$("div.write-problem");

    for(const problem of problems) {
        let problem_id = problem.getElementsByClassName("probleminput")[0].id;
        if(solved.includes(problem_id)) {
            console.log(`Marking ${problem_id} as complete`);
            problem.classList.remove("write-problem");
            problem.classList.add("success");
        }
    }
}


// To be implemented (template)

/*
function quizzes_status(callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText.split(" "));
        }
    }
    xhttp.open("GET","api/sql_status.php?token="+mooc_token,true);
    xhttp.send();
}

function quizzes_send(task,sql,result,callback) {
    result = result ? 1 : 0;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback();
        }
    }
    xhttp.open("POST","api/sql_send.php",true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("token="+mooc_token+"&"+
                "task="+task+"&"+
                "result="+result+"&"+
                "data="+encodeURIComponent(sql));
}

function quizzes_answer(task,callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    }
    xhttp.open("GET","api/sql_answer.php?token="+mooc_token+"&task="+task,true);
    xhttp.send();
}

function quizzes_model(task,callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    }
    xhttp.open("GET","api/sql_model.php?token="+mooc_token+"&task="+task,true);
    xhttp.send();
}
*/

function logincallback(){
    console.log("TOKEN: " + mooc_token);
    console.log("STATUS: " + mooc_status);
}

