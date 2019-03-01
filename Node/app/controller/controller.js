const uploadFolder = __basedir + "/uploads/";
var async = require('async');
var elasticsearch = require("elasticsearch");
var validator = require("aadhaar-validator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/config.js");
var generator = require("generate-password");
var nodemailer = require('nodemailer');
var fs = require('fs');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nagarajesh.venturi@aaravsolutions.com',
    pass: 'N3ed4p@S5w0rd'
  }
});
// const sendmail = require("sendmail")({
//   logger: {
//     debug: console.log,
//     info: console.info,
//     warn: console.warn,
//     error: console.error
//   },
//   silent: false
// });
var client = new elasticsearch.Client({
  hosts: ["http://localhost:9200"]
});

async function checkelasticsearch(callback) {
  client.ping(
    {
      requestTimeout: 30000
    },
    function(error) {
      if (error) {
        //console.error('elasticsearch cluster is down!');
        callback({
          message: "elasticsearch cluster is down!"
        });
      } else {
        callback({
          message: "ok"
        });
      }
    }
  );
}

exports.create = async function (req, res) {
  console.log(req.body);
  var passwordtobesend = "";
  var personalemail = "";
  var companyemail = "";
  var employeeid = "";
  var employeename = "";
  var manageremail = "";
  var employeeidsendemail = "";
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    console.log("debug1");
    if (data.message == "ok") {
      //check whether employee exist or not
      client
        .search({
          index: "employees",
          type: "employee",
          body: {
            query: {
              match: {
                employeeid: req.body.Employeeid
              }
            }
          }
        })
        .then(
          function(resp) {
            var idcheck;
            resp.hits.hits.forEach(function(hit) {
              console.log(hit);
              idcheck = hit;
            });
            if (idcheck == null) {
              //check whether employee id exist or not
              client
                .search({
                  index: "employees",
                  type: "employee",
                  body: {
                    query: {
                      match: {
                        employeeid: req.body.Employeeid
                      }
                    }
                  }
                })
                .then(
                  function(resp) {
                    //check whether username exist or not

                    client
                      .search({
                        index: "employees",
                        type: "employee",
                        body: {
                          query: {
                            match: {
                              username: req.body.officeemail
                            }
                          }
                        }
                      })
                      .then(
                        function(resp) {
                          console.log("debug2", resp);
                          //check for employee record
                          var employeedoc;
                          resp.hits.hits.forEach(function(hit) {
                            console.log(hit);
                            employeedoc = hit;
                          });
                          if (employeedoc == null) {
                            //if employee record not found create it
                            console.log("debug3");
                            //check adhar card valid or not
                            if (validator.isValidNumber(req.body.adhar)) {
                              var dynamicpassword = generator.generate({
                                length: 10,
                                numbers: true
                              });
                              passwordtobesend = dynamicpassword;
                              personalemail = req.body.personalemail;
                              employeeid = req.body.Employeeid;
                              companyemail = req.body.officeemail;
                              employeename =
                                req.body.firstname +
                                " " +
                                req.body.middlename +
                                " " +
                                req.body.lastname;
                              manageremail = req.body.reportinmanageremail;
                              (employeeidsendemail = req.body.Employeeid),
                                client.index(
                                  {
                                    index: "employees",
                                    id: req.body.Employeeid,
                                    type: "employee",
                                    body: {
                                      employeeid: req.body.Employeeid,
                                      password: bcrypt.hashSync(
                                        dynamicpassword,
                                        8
                                      ),
                                      username: req.body.officeemail,
                                      firstname: req.body.firstname,
                                      middlename: req.body.middlename,
                                      lastname: req.body.lastname,
                                      employeetype: req.body.employeetype,
                                      desigination: req.body.desigination,
                                      practice: req.body.practice,
                                      officeemail: req.body.officeemail,
                                      department: req.body.department,
                                      personalemail: req.body.personalemail,
                                      reportingmanager:
                                        req.body.reportingmanager,
                                      reportinmanageremail:
                                        req.body.reportinmanageremail,
                                      mentor: req.body.mentor,
                                      dob: req.body.dob,
                                      joiningdate: req.body.JoiningDate,
                                      careerstartingdate:
                                        req.body.careerStartingDate,
                                      adhar: req.body.adhar,
                                      pan: req.body.pan,
                                      passport: req.body.passport,
                                      sex: req.body.sex,
                                      marraige: req.body.Marraige,
                                      bloodgroup: req.body.Bloodgroup,
                                      presentadd: req.body.presentadd,
                                      premenantadd: req.body.premenantadd,
                                      extension: req.body.extension,
                                      phonenumber: req.body.phonenumber,
                                      createddate: req.body.createddate,
                                      jobstatus: req.body.status,
                                      emailverified: req.body.emailverified,
                                      imageURL: req.body.imageURL,
                                      resumeURL: req.body.resumeURL,
                                      adminaccess: req.body.adminaccess,
                                      manager: req.body.manager,
                                      projects: req.body.projects,
                                      helathinsurance: req.body.health,
                                      skills: req.body.skills,
                                      itassets: req.body.itassets,
                                      previousexpreince: req.body.previousexpreince,
                                      fresher: req.body.fresher,
                                      itadmin: req.body.itadmin,
                                      leaves: req.body.leaves
                                    }
                                  },
                                  function(err, resp, status) {
                                    if (err) {
                                      console.log("debug err");
                                      res.status(400).json({
                                        message: "Error while creating Index",
                                        status: status,
                                        error: err
                                      });
                                    } else {
                                      //If employee is manager add him to managerlist
                                      if (req.body.manager === true) {
                                        client.update(
                                          {
                                            index: "managers",
                                            id: 1,
                                            type: "manager",
                                            body: {
                                              script: {
                                                lang: "painless",
                                                inline:
                                                  "ctx._source.managerlist.add(params.managerlist);",
                                                params: {
                                                  managerlist: {
                                                    name: req.body.firstname,
                                                    email: req.body.officeemail
                                                  }
                                                }
                                              }
                                            }
                                          },
                                          function(err, resp, status) {
                                            if (err) {
                                              client.delete(
                                                {
                                                  index: "employees",
                                                  type: "employee",
                                                  id: req.body.Employeeid
                                                },
                                                function(err, resp, status) {
                                                  if (err) {
                                                    res.status(400).json({
                                                      message:
                                                        "Issue while deleting employee contact admin",
                                                      index: false
                                                    });
                                                  }
                                                }
                                              );
                                              res.status(400).json({
                                                message:
                                                  "Issue with appending manger index contact admin",
                                                index: false
                                              });
                                            } else {
                                              /*console.log("debug3");

                                              res.status(200).json({
                                                message:
                                                  "employee created succesfully",
                                                status: status,
                                                response: resp
                                              });*/
                                              var emailres = sendemailoncreation(
                                                employeeidsendemail,
                                                passwordtobesend,
                                                personalemail,
                                                companyemail,
                                                manageremail,
                                                employeename,
                                                resp,
                                                res,
                                                status
                                              );
                                            }
                                          }
                                        );
                                      } else {
                                        console.log("debug3");
                                        var emailres = sendemailoncreation(
                                          employeeidsendemail,
                                          passwordtobesend,
                                          personalemail,
                                          companyemail,
                                          manageremail,
                                          employeename,
                                          resp,
                                          res,
                                          status
                                        );
                                      }
                                    }
                                  }
                                );
                            } else {
                              res.status(400).json({
                                message: "Adhar invalid",
                                Adhar: false
                              });
                            }
                          } else {
                            //employee username already exist
                            res.status(400).json({
                              message: "Employee email address  already taken!",
                              username: false
                            });
                          }
                        },
                        function(err) {
                          console.log(err.message);
                        }
                      );
                  },
                  function(err) {
                    console.log(err.message);
                  }
                );
            } else {
              res.status(400).json({
                message: "Employeed ID already taken",
                employeeid: false
              });
            }
          },
          function(err) {
            console.log(err.message);
          }
        );
    } else {
      res.status(400).json({ Message: "Severisdown" });
    }
  });
};

exports.saveFiles = async function (req,res) {
  console.log("file input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      //delete if getting replace here
      

      client.update(
        {
          index: "employees",
          id: req.body.employeeid,
          type: "employee",
          body: {
            script: {
              lang: "painless",
              inline:
                "if(ctx._source.imageURL != params.imageURL){ ctx._source.imageURL = params.imageURL} if(ctx._source.resumeURL != params.resumeURL){	ctx._source.resumeURL = params.resumeURL}",
              params: {
                imageURL: req.body.imageURL,
                resumeURL: req.body.resumeURL
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while updating files",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "files update sucessfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
}

exports.findAll = async function (req, res) {
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      client
        .search({
          index: "employees",
          type: "employee",
          body: {
            query: {
              "match_all":{}
            }
          }
        })
        .then(
          function(resp) {
            resp.hits.hits.forEach(function(hit) {
              //console.log(hit._source.username + hit._source.password);
              res.send(hit);
            });
          },
          function(err) {
            console.trace(err.message);
          }
        );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.signin = async function (req, res) {
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      client
        .search({
          index: "employees",
          type: "employee",
          body: {
            query: {
              match: {
                username: req.body.username
              }
            }
          }
        })
        .then(
          function(resp) {
            var userToken;

            resp.hits.hits.forEach(function(hit) {
              userToken = hit;
            });
            if (userToken == null) {
              res.send({ message: "Document not found" });
            } else {
              var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                userToken._source.password
              );
              if (!passwordIsValid) {
                return res.status(401).send({
                  auth: false,
                  accessToken: null,
                  reason: "Invalid Password!"
                });
              } else {
                console.log("password is valid", userToken._id);
                var token = jwt.sign({ id: userToken._id }, config.secret, {
                  expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, accessToken: token });
              }
            }
          },
          function(err) {
            console.trace(err.message);
          }
        );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.getuserprofile = async function (req, res) {
  checkelasticsearch(function(data) {
    console.log(data);
    if (data.message == "ok") {
      client
        .search({
          index: "employees",
          type: "employee",
          body: {
            query: {
              match: {
                username: req.body.username
              }
            }
          }
        })
        .then(
          function(resp) {
            var userToken;

            resp.hits.hits.forEach(function(hit) {
              userToken = hit;
            });
            if (userToken == null) {
              res.status(400).json({ message: "Document not found" });
            } else {
              res.status(200).json(userToken);
            }
          },
          function(err) {
            console.trace(err.message);
          }
        );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.uploadFile = async (req, res) => {
  res.status(200).send(req.file.filename);
};

exports.deleteFile = async (req, res) => {
  fs.unlink( __basedir+"/uploads/"+req.body.filename, function(err) {
    if(err) {
      console.log('error while deleting file', err);
    }
  });
}

exports.downloadFile = async (req, res) => {
  let filename = req.params.filename;
  res.download(uploadFolder + filename);
};

exports.createindex = async function (req, res) {
  client.indices.create(
    {
      index: "employees"
    },
    function(err, resp, status) {
      if (err) {
        console.log(err);
      } else {
        console.log("create", resp);
      }
    }
  );
};

exports.getindex = async function (req, res) {
  client
    .search({
      index: "employees",
      type: "employee",
      body: {
        query: {
          match: {
            username: "prudhvi.akella@aaravsolutions.com"
          }
        }
      }
    })
    .then(function(resp) {
      res.send(resp);
    });
};

exports.addtimeentry = async function (req, res) {
  console.log(req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    console.log("debug1");
    if (data.message == "ok") {
      if (req.body._id != null) {
        var Rejectdescpriton = "";
        if (req.body.managerstatus == "Reject") {
          Rejectdescpriton = req.body.Rejectdescription;
        }
        client.index(
          {
            index: "timesheets",
            type: "timesheet",
            id: req.body._id,
            body: {
              employeeid: req.body.employeeid,
              startdate: req.body.startdate,
              enddate: req.body.enddate,
              weekentry: req.body.weekentry,
              weekendentry: req.body.weekendentry,
              status: req.body.status,
              managerstatus: req.body.managerstatus,
              managername: req.body.managername,
              manageremail: req.body.manageremail,
              datelist: req.body.datelist,
              rejectdescription: Rejectdescpriton
            }
          },
          async function(err, resp, status) {
            if (err) {
              console.log("debug err");
              console.log(err);
              res.status(400).json({
                message: "Error while adding timesheet entry",
                status: status,
                error: err
              });
            } else {
              console.log("tim");
              res.status(200).json({
                message: "timesheet added succesfully",
                status: status,
                response: resp
              });
            }
          }
        );
      } else {
        client.index(
          {
            index: "timesheets",
            type: "timesheet",
            body: {
              employeeid: req.body.employeeid,
              startdate: req.body.startdate,
              enddate: req.body.enddate,
              weekentry: req.body.weekentry,
              weekendentry: req.body.weekendentry,
              status: req.body.status,
              managerstatus: req.body.managerstatus,
              managername: req.body.managername,
              manageremail: req.body.manageremail,
              datelist: req.body.datelist
            }
          },
          function(err, resp, status) {
            if (err) {
              console.log("debug err");
              console.log(err);
              res.status(400).json({
                message: "Error while adding timesheet entry",
                status: status,
                error: err
              });
            } else {
              console.log("tim");
              sendtimesheetemail(
                req.body.employeeid,
                req.body.managername,
                req.body.manageremail,
                req.body.startdate,
                req.body.enddate
              )
              res.status(200).json({
                message: "timesheet added succesfully",
                status: status,
                response: resp
              });
            }
          }
        );
      }
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.gettimesheet = async function (req, res) {
  client
    .search({
      index: "timesheets",
      type: "timesheet",
      body: {
        query: {
          bool: {
            must: [
              {
                term: { employeeid: req.body.employeeid }
              },
              {
                term: { startdate: req.body.startdate }
              },
              {
                term: { enddate: req.body.enddate }
              }
            ]
          }
        }
      }
    })
    .then(function(resp) {
      console.log(resp);
      var timesheet;
      resp.hits.hits.forEach(function(hit) {
        timesheet = hit;
        console.log(hit);
      });
      if (timesheet != null) {
        res.status(200).json({ status: "find", response: timesheet });
      } else {
        res.status(200).json({ status: "nofind" });
      }
    });
};

exports.getreports = async function (req, res) {
  if(req.body.group == 'all') {
    client
    .search({
      index: "timesheets",
      type: "timesheet",
      body: {
        query: {
          bool: {
            must: [
              {
                term: { status: 'submit' }
              },
              {
                "range": {
                  "startdate": {
                    "gte": req.body.startdate
                  }
                }
              },
              {
                "range": {
                  "enddate": {
                    "lte": req.body.enddate
                  }
                }
              }
            ]
          }
        }
      }
    })
    .then(function(resp) {
      console.log(resp);
      var report;
      resp.hits.hits.forEach(function(hit) {
        report = hit;
        console.log(hit);
      });
      if (report != null) {
        res.status(200).json({ status: "find", response: resp });
      } else {
        res.status(200).json({ status: "nofind" });
      }
    });
  }
  if(req.body.group == 'byemployee') {
    client
    .search({
      index: "timesheets",
      type: "timesheet",
      body: {
        query: {
          bool: {
            must: [
              {
                term: { status: 'submit' }
              },
              {
                term: { employeeid: req.body.employeeid }
              },
              {
                "range": {
                  "startdate": {
                    "gte": req.body.startdate
                  }
                }
              },
              {
                "range": {
                  "enddate": {
                    "lte": req.body.enddate
                  }
                }
              }
            ]
          }
        }
      }
    })
    .then(function(resp) {
      console.log(resp);
      var report;
      resp.hits.hits.forEach(function(hit) {
        report = hit;
        console.log(hit);
      });
      if (report != null) {
        res.status(200).json({ status: "find", response: resp });
      } else {
        res.status(200).json({ status: "nofind" });
      }
    });
  }
  if(req.body.group == 'bymanager') {
    client
    .search({
      index: "timesheets",
      type: "timesheet",
      body: {
        query: {
          bool: {
            must: [
              {
                term: { status: 'submit' }
              },
              {
                term: { manageremail: req.body.managerid }
              },
              {
                "range": {
                  "startdate": {
                    "gte": req.body.startdate
                  }
                }
              },
              {
                "range": {
                  "enddate": {
                    "lte": req.body.enddate
                  }
                }
              }
            ]
          }
        }
      }
    })
    .then(function(resp) {
      console.log(resp);
      var report;
      resp.hits.hits.forEach(function(hit) {
        report = hit;
        console.log(hit);
      });
      if (report != null) {
        res.status(200).json({ status: "find", response: resp });
      } else {
        res.status(200).json({ status: "nofind" });
      }
    });
  }
};

exports.getleavebydate = async function (req, res) {
  client
    .search({
      index: "leaves",
      type: "leave",
      body: {
        query: {
          bool: {
            must: [
              {
                term: { employeeid: req.body.employeeid }
              },
              {
                "range": {
                  "startdate": {
                    "gte": req.body.fromdate
                  }
                }
              },
              {
                "range": {
                  "enddate": {
                    "lte": req.body.todate
                  }
                }
              }
            ]
          }
        }
      }
    })
    .then(function(resp) {
      console.log(resp);
        res.status(200).json({ response: resp });
      });
};

exports.saveskills = async function (req, res) {
  console.log("input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      console.log("skills are:", req.body.skills);
      client.update(
        {
          index: "employees",
          id: req.body.employeeid,
          type: "employee",
          body: {
            script: {
              lang: "painless",
              inline:
                "if(ctx._source.skills.length != 0){for(int i = 0; i < params.skills.length; ++i){ int k= 0;for (int j = 0; j < ctx._source.skills.length; ++j){   if(ctx._source.skills[j].skillname == params.skills[i].skillname){k++} } if(k ==0){ctx._source.skills.add(params.skills[i])}}for(int k = 0; k < ctx._source.skills.length; ++k){int m=0;for(int l = 0; l < params.skills.length; ++l){if(ctx._source.skills[k].skillname == params.skills[l].skillname){m++}}if(m == 0){ctx._source.skills.remove(k)}}}else{for(int i =0;i <params.skills.length; ++i){ctx._source.skills.add(params.skills[i])}}",
              params: {
                skills: req.body.skills
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while updating skills",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "skills update sucessfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.saveassets = async function (req, res) {
  console.log("input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      console.log("asserts are:", req.body.itassets);
      client.update(
        {
          index: "employees",
          id: req.body.employeeid,
          type: "employee",
          body: {
            script: {
              lang: "painless",
              inline:
                "if(ctx._source.itassets.length != 0){for(int i = 0; i < params.itassets.length; ++i){ int k= 0;for (int j = 0; j < ctx._source.itassets.length; ++j)	{ if(ctx._source.itassets[j].id == params.itassets[i].id)	{k++}} if(k ==0){ctx._source.itassets.add(params.itassets[i])	}}	for(int k = 0; k < ctx._source.itassets.length; ++k){int m=0;	for(int l = 0; l < params.itassets.length; ++l){	if(ctx._source.itassets[k].id == params.itassets[l].id){m++}}if(m == 0){ctx._source.itassets.remove(k)}}}else{for(int i =0;i <params.itassets.length; ++i){ctx._source.itassets.add(params.itassets[i])}}",
              params: {
                itassets: req.body.itassets
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while updating it assets",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "assets update sucessfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.getholidaylist = async function (req, res) {
  console.log("input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      //console.log("skills are:", req.body.skills);
      client.search(
        {
          index: "holidays",
          type: "holiday",
          body: {
            query: {
              nested: {
                path: "holidaylist",
                query: {
                  bool: {
                    must: [
                      {
                        match: { "holidaylist.year": req.body.year }
                      },
                      {
                        match: { "holidaylist.country": req.body.country }
                      }
                    ]
                  }
                },
                inner_hits: { size: 50 }
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while retriving holiday list",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "Holidaylist is",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.saveholiday = async function (req, res) {
  //console.log("input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      console.log("holidaylist are:", req.body.holidaylist);
      client.update(
        {
          index: "holidays",
          id: 1,
          type: "holiday",
          body: {
            script: {
              lang: "painless",
              inline:
                "if(ctx._source.holidaylist.length != 0){for(int i = 0; i < params.holidaylist.length; ++i){int k= 0;for (int j = 0; j < ctx._source.holidaylist.length; ++j){if(ctx._source.holidaylist[j].occasion == params.holidaylist[i].occasion&&ctx._source.holidaylist[j].country == params.holidaylist[i].country&&ctx._source.holidaylist[j].year == params.holidaylist[i].year){k++}}if(k ==0){ctx._source.holidaylist.add(params.holidaylist[i])}}for(int k = 0; k < ctx._source.holidaylist.length; ++k){int m=0;for(int l = 0; l < params.holidaylist.length; ++l){if(ctx._source.holidaylist[k].occasion == params.holidaylist[l].occasion && ctx._source.holidaylist[k].country == params.holidaylist[l].country && ctx._source.holidaylist[k].year == params.holidaylist[l].year){m++} if(ctx._source.holidaylist[k].country != params.holidaylist[l].country){m++}}if(m == 0){ctx._source.holidaylist.remove(k)}}}else{for(int i =0;i <params.holidaylist.length; ++i){ctx._source.holidaylist.add(params.holidaylist[i])}}",
              params: {
                holidaylist: req.body.holidaylist
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while updating holiday",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "holiday list updated sucessfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.addclinetproject = async function (req, res) {
  console.log("input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      //console.log("holidaylist are:", req.body.holidaylist);
      client.update(
        {
          index: "projects",
          id: 1,
          type: "project",
          body: {
            script: {
              lang: "painless",
              inline:
                "if(ctx._source.projectlist.length != 0){for(int i = 0; i < params.projectlist.length; ++i){int k= 0;for (int j = 0; j < ctx._source.projectlist.length; ++j){if(ctx._source.projectlist[j].name == params.projectlist[i].name&&ctx._source.projectlist[j].clientname == params.projectlist[i].clientname){k++}}if(k ==0){ctx._source.projectlist.add(params.projectlist[i])}}}else{for(int i =0;i <params.projectlist.length; ++i){ctx._source.projectlist.add(params.projectlist[i])}}",
              params: {
                projectlist: req.body
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while updating projectlist",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "project list updated sucessfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.addclient = async function (req, res) {
  console.log("clientinput", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      //console.log("holidaylist are:", req.body.holidaylist);
      client.update(
        {
          index: "clients",
          id: 1,
          type: "client",
          body: {
            script: {
              lang: "painless",
              inline:
                "if(ctx._source.clientlist.length != 0){for(int i = 0; i < params.clientlist.length; ++i){int k= 0;for (int j = 0; j < ctx._source.clientlist.length; ++j){if(ctx._source.clientlist[j].name == params.clientlist[i].name){k++}}if(k ==0){ctx._source.clientlist.add(params.clientlist[i])}}}else{for(int i =0;i <params.clientlist.length; ++i){ctx._source.clientlist.add(params.clientlist[i])}}",
              params: {
                clientlist: req.body
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while updating clinetlist",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "clinet list updated sucessfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.getemployeesbymanager = async function (req, res) {
  console.log("input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      //console.log("skills are:", req.body.skills);
      client.search(
        {
          index: "employees",
          type: "employee",
          body: {
            _source: ["employeeid", "firstname", "username"],
            query: {
              match: {
                reportingmanager: req.body.firstname
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while retriving manager employee list",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "employee list is",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.getprojectsformanager = function (req, res) {
  console.log("input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      //console.log("skills are:", req.body.skills);
      client.search(
        {
          index: "projects",
          type: "project",
          body: {
            query: {
              nested: {
                path: "projectlist",
                query: {
                  bool: {
                    must: [
                      {
                        match: { "projectlist.createby": req.body.employeeid }
                      }
                    ]
                  }
                },
                inner_hits: { size: 50 }
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while retriving client and project details",
              status: status,
              error: err
            });
          } else {
            console.log(resp);
            res.status(200).json({
              message: "employee list is",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.updateemployeeprojects = async function (req, res) {
  console.log("input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      console.log("holidaylist are:", req.body.holidaylist);
      client.update(
        {
          index: "employees",
          id: req.body.employeeid,
          type: "employee",
          body: {
            script: {
              lang: "painless",
              inline:
                "if(ctx._source.projects.length != 0){for(int i = 0; i < params.projectlist.length; ++i){int k= 0;for (int j = 0; j < ctx._source.projects.length; ++j){if(ctx._source.projects[j].projectname == params.projectlist[i].projectname&&ctx._source.projects[j].clientname == params.projectlist[i].clientname){k++}}if(k ==0){ctx._source.projects.add(params.projectlist[i])}}for(int k = 0; k < ctx._source.projects.length; ++k){int m=0;for(int l = 0; l < params.projectlist.length; ++l){if(ctx._source.projects[k].projectname == params.projectlist[l].projectname && ctx._source.projects[k].clientname == params.projectlist[l].clientname){m++}}if(m == 0){ctx._source.projects.remove(k)}}}else{for(int i =0;i <params.projectlist.length; ++i){ctx._source.projects.add(params.projectlist[i])}}",
              params: {
                projectlist: req.body.projectlist
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while updating employee project",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "projects updated sucessfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.gettimesheetformanager = async function (req, res) {
  console.log("input", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      //console.log("skills are:", req.body.skills);
      client.search(
        {
          index: "timesheets",
          type: "timesheet",
          body: {
            query: {
              bool: {
                must: [
                  {
                    match: {
                      manageremail: req.body.username
                    }
                  },
                  {
                    match: {
                      managerstatus: "New"
                    }
                  },
                  {
                    match: {
                      status: "submit"
                    }
                  }
                ]
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while retriving manager timesheet details",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "timesheets are",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.getholidaybydate = async function (req, res) {
  client
    .search({
      index: "holidays",
      type: "holiday",
      body: {
        query: {
          nested: {
            path: "holidaylist",
            query: {
              range: {
                "holidaylist.date": {
                  gte: req.body.monthstartdate,
                  lte: req.body.monthenddate
                }
              }
            },
            inner_hits: { size: 50 }
          }
        }
      }
    })
    .then(function(resp) {
      console.log(resp);
      var timesheet;
      resp.hits.hits.forEach(function(hit) {
        timesheet = hit;
        console.log(hit);
      });
      if (timesheet != null) {
        res.status(200).json({ status: "find", response: timesheet });
      } else {
        res.status(200).json({ status: "nofind" });
      }
    });
};

exports.gettimesheetholidaybydate = async function (req, res) {
  client
    .search({
      index: "holidays",
      type: "holiday",
      body: {
        query: {
          nested: {
            path: "holidaylist",
            query: {
              range: {
                "holidaylist.date": {
                  gte: req.body.fromdate,
                  lte: req.body.todate
                }
              }
            },
            inner_hits: { size: 50 }
          }
        }
      }
    })
    .then(function(resp) {
      console.log(resp);
        res.status(200).json({ response: resp });
    })
};

exports.addleaveentry = async function (req, res) {
  console.log(req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    console.log("debug1");
    if (data.message == "ok") {
      client.index(
        {
          index: "leaves",
          type: "leave",
          body: {
            employeeid: req.body.employeeid,
            createdate: req.body.createdate,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            leavetype: req.body.leavetype,
            employeeid: req.body.employeeid,
            employeeemail: req.body.employeeemail,
            manageremail: req.body.manageremail,
            managername: req.body.managername,
            managereid: req.body.managereid,
            status: req.body.status,
            appliedleaves: req.body.leavesapplied,
            description: req.body.description
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while adding leave entry",
              status: status,
              error: err
            });
          } else {
            console.log("leav");
            sendleaveemail(
              req.body.employeeid,
              req.body.managername,
              req.body.manageremail,
              req.body.startdate,
              req.body.enddate
            )
            res.status(200).json({
              message: "leave entry succesfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.updateleavesforemployee = async function (req, res) {
  console.log("updateleaves", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      //console.log("holidaylist are:", req.body.holidaylist);
      client.update(
        {
          index: "employees",
          id: req.body.employeeid,
          type: "employee",
          body: {
            script: {
              lang: "painless",
              inline:
                "if(ctx._source.leaves.length != 0){ if(params.type == 'Earned Leave'){ctx._source.leaves[0].earnedleave = ctx._source.leaves[0].earnedleave - params.leaves}if(params.type == 'Casual Leave'){ctx._source.leaves[0].casualleave = ctx._source.leaves[0].casualleave - params.leaves}if(params.type == 'Optional Holiday'){ctx._source.leaves[0].optionalholiday = ctx._source.leaves[0].optionalholiday - params.leaves}}",
              params: {
                type: req.body.type,
                leaves: req.body.leave
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while updating employee leaves",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "updated  employee leaves sucessfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.reupdateleaves = async function (req, res) {
  console.log("updateleaves", req.body);
  //check whether Elastic search is running or not
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      //console.log("holidaylist are:", req.body.holidaylist);
      client.update(
        {
          index: "employees",
          id: req.body.employeeid,
          type: "employee",
          body: {
            script: {
              lang: "painless",
              inline:
                "if(ctx._source.leaves.length != 0){ if(params.type == 'Earned Leave'){ctx._source.leaves[0].earnedleave = ctx._source.leaves[0].earnedleave + params.leaves}if(params.type == 'Casual Leave'){ctx._source.leaves[0].casualleave = ctx._source.leaves[0].casualleave + params.leaves}if(params.type == 'Optional Holiday'){ctx._source.leaves[0].optionalholiday = ctx._source.leaves[0].optionalholiday + params.leaves}}",
              params: {
                type: req.body.type,
                leaves: req.body.leave
              }
            }
          }
        },
        function(err, resp, status) {
          if (err) {
            console.log("debug err");
            console.log(err);
            res.status(400).json({
              message: "Error while re updating employee leaves",
              status: status,
              error: err
            });
          } else {
            res.status(200).json({
              message: "re updated  employee leaves sucessfully",
              status: status,
              response: resp
            });
          }
        }
      );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

async function sendtimesheetemail(
  employeeid,
  managername,
  managermail,
  fromdate,
  todate
) {
  var errorString = "";
  transporter.sendMail(
    {
      from: "nagarajesh.venturi@aaravsolutions.com",
      to: managermail,
      //cc:managermail
      subject: "Timesheet Notification",
      html:
        '<body style="font-size: 12px;font-family: Bitter;">\n' +
        "<p> Hi" +
        managername +
        ",</p>\n<p> Employee with id " +
        employeeid +
        "has submitted timesheet for " +
        fromdate +
        " - " +
        todate +
        "</p>" +
        "<p>Regards,</p>\n" +
        "<p>Nagarajesh Venturi</p>" +
        "</body>"
    },
    function(err, reply) {
      if (err) {
        console.log(err && err.stack);
        res.status(400).json({
          message: "Failed to send notification to manager",            
        });
      }
      if (reply) {
        console.log(reply);
        res.status(200).json({
          message: "Timesheet Notifications sent to manager",
          status: status,
          response: resp
        });
      }
    }
  );
}

async function sendleaveemail(
  employeeid,
  managername,
  managermail,
  fromdate,
  todate
) {
  var errorString = "";
  transporter.sendMail(
    {
      from: "nagarajesh.venturi@aaravsolutions.com",
      to: managermail,
      //cc:managermail
      subject: "Leave Notification",
      html:
        '<body style="font-size: 12px;font-family: Bitter;">\n' +
        "<p> Hi " +
        managername +
        ",</p>\n<p> Employee with id " +
        employeeid +
        "has applied leave for " +
        fromdate +
        " - " +
        todate +
        "</p>\n" +
        "<p>Regards,</p>\n" +
        "<p>Nagarajesh Venturi</p>" +
        "</body>"
    },
    function(err, reply) {
      if (err) {
        console.log(err && err.stack);
        // res.status(400).json({
        //   message: "Failed to send notification to manager",            
        // });
      }
      if (reply) {
        console.log(reply);
        // res.status(200).json({
        //   message: "Leave Notifications sent to manager",
        //   status: status,
        //   response: resp
        // });
      }
    }
  );
}

exports.sendrejectleaveemail  = async function (req, res) {
  console.log('sending leave reject mail');
  transporter.sendMail(
    {
      from: "nagarajesh.venturi@aaravsolutions.com",
      to: req.body.employeeemail,
      //cc:managermail
      subject: "Leave Notification",
      html:
        '<body style="font-size: 12px;font-family: Bitter;">\n' +
        "<p> Hi " +
        req.body.employeename +
        ",</p>\n<p> Your leave request for " +
        req.body.fromdate +
        " - " +
        req.body.todate +
        " has been rejected.</p>\n" +
        "<p>Regards,</p>\n" +
        "<p>Nagarajesh Venturi</p>" +
        "</body>"
    },
    function(err, reply) {
      if (err) {
        console.log(err && err.stack);
        res.status(400).json({
          message: "Failed to send notification to employee",            
        });
      }
      if (reply) {
        console.log(reply);
        res.status(200).json({
          message: "Leave Reject Notification sent to employee",
          status: status,
          response: resp
        });
      }
    }
  );
}
exports.sendtimesheetrejectemail  = async function (req, res) {
  console.log('sending timesheet reject mail');
  transporter.sendMail(
    {
      from: "nagarajesh.venturi@aaravsolutions.com",
      to: req.body.employeeemail,
      //cc:managermail
      subject: "Timesheet Notification",
      html:
        '<body style="font-size: 12px;font-family: Bitter;">\n' +
        "<p> Hi " +
        req.body.employeename +
        ",</p>\n<p> Your timesheet for " +
        req.body.fromdate +
        " - " +
        req.body.todate +
        " has been rejected.</p>\n" +
        "<p>Regards,</p>\n" +
        "<p>Nagarajesh Venturi</p>" +
        "</body>"
    },
    function(err, reply) {
      if (err) {
        console.log(err && err.stack);
        res.status(400).json({
          message: "Failed to send notification to employee",            
        });
      }
      if (reply) {
        console.log(reply);
        res.status(200).json({
          message: "Timesheet Reject Notification sent to employee",
          status: status,
          response: resp
        });
      }
    }
  );
}

exports.getuserprofilebyid = async function (req, res) {
  checkelasticsearch(function(data) {
    console.log(data);
    if (data.message == "ok") {
      client
        .search({
          index: "employees",
          type: "employee",
          body: {
            query: {
              match: {
                employeeid: req.body.employeeid
              }
            }
          }
        })
        .then(
          function(resp) {
            var userToken;

            resp.hits.hits.forEach(function(hit) {
              userToken = hit;
            });
            if (userToken == null) {
              res.status(400).json({ message: "Document not found" });
            } else {
              res.status(200).json(userToken);
            }
          },
          function(err) {
            console.trace(err.message);
          }
        );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

async function sendemailoncreation(
  employeeid,
  password,
  companyemail,
  aaravemail,
  managermail,
  name,
  resp,
  res,
  status
) {
  var errorString = "";
  transporter.sendMail(
    {
      from: "nagarajesh.venturi@aaravsolutions.com",
      to: companyemail,
      //cc:managermail
      subject: "AARAV USER CREATION",
      html:
        '<body style="font-size: 12px;font-family: Bitter;">\n' +
        "<p>Hello " +
        name +
        ",</p>\n<p>Weclome to Aaravsolutions</p>\n" +
        "<p> Please see your Aarav&nbsp;Email and&nbsp; Portal login details.</p> \n" +
        "<p>1. Username : " +
        aaravemail +
        "</p>\n" +
        "<p>2. Email Id : " +
        aaravemail +
        "</p>\n" +
        "<p>3. Password : " +
        password +
        "</p>\n" +
        "<p>Regards,</p>\n" +
        "<p>Nagarajesh Venturi</p>" +
        "</body>"
    },
    function(err, reply) {
      if (err) {
        console.log(err && err.stack);
        client.delete(
          {
            index: "employees",
            type: "employee",
            id: employeeid
          },
          function(err, resp, status) {
            if (err) {
              res.status(400).json({
                message:
                  "Issue while deleting employee email send contact admin",
                index: false
              });
            }
            if (resp) {
              res.status(400).json({
                message:
                  "Issue with sending password to employee contact admin",
                index: false
              });
            }
          }
        );
      }
      if (reply) {
        console.log(reply);
        res.status(200).json({
          message: "employee created succesfully",
          status: status,
          response: resp
        });
      }
    }
  );
}

exports.resetpassword = async function (req, res) {
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      client
        .search({
          index: "employees",
          type: "employee",
          body: {
            query: {
              match: {
                username: req.body.username
              }
            }
          }
        })
        .then(
          function(resp) {
            var userToken;
            console.log(resp);
            resp.hits.hits.forEach(function(hit) {
              userToken = hit;
            });
            if (userToken == null) {
              res.send({ message: "Document not found" });
            } else {
              console.log("hits are", userToken);
              var passwordIsValid = bcrypt.compareSync(
                req.body.oldpassword,
                userToken._source.password
              );
              if (!passwordIsValid) {
                console.log("Invalid old password");
                return res.status(401).send({
                  auth: false,
                  accessToken: null,
                  reason: "Invalid Password!"
                });
              } else {
                client.update(
                  {
                    index: "employees",
                    id: req.body.employeeid,
                    type: "employee",
                    body: {
                      script: {
                        lang: "painless",
                        inline: "ctx._source.password = params.password",
                        params: {
                          password: bcrypt.hashSync(req.body.newpassword, 8)
                        }
                      }
                    }
                  },
                  function(err, resp, status) {
                    if (err) {
                      console.log("debug err");
                      console.log(err);
                      res.status(400).json({
                        message: "Error while  updating new password",
                        status: status,
                        error: err
                      });
                    } else {
                      client.update(
                        {
                          index: "employees",
                          id: req.body.employeeid,
                          type: "employee",
                          body: {
                            script: {
                              lang: "painless",
                              inline:
                                "ctx._source.emailverified = params.emailverified",
                              params: {
                                emailverified: "Yes"
                              }
                            }
                          }
                        },
                        function(err, resp, status) {
                          if (err) {
                            console.log("debug err");
                            console.log(err);
                            res.status(400).json({
                              message:
                                "Error while  updating email verified status",
                              status: status,
                              error: err
                            });
                          } else {
                            var token = jwt.sign(
                              { id: resp._id },
                              config.secret,
                              {
                                expiresIn: 86400 // expires in 24 hours
                              }
                            );
                            res
                              .status(200)
                              .send({ auth: true, accessToken: token });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          },
          function(err) {
            console.trace(err.message);
          }
        );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });
};

exports.updateforgetpassword = async function (req, res) {
  var passwordtobesend = "";
  var personalemail = "";
  var companyemail = "";
  var employeeid = "";
  var employeename = "";
  var manageremail = "";
  var employeeidsendemail = "";
  var userToken;
  console.log(req);
  checkelasticsearch(function(data) {
    if (data.message == "ok") {
      client
        .search({
          index: "employees",
          type: "employee",
          body: {
            query: {
              match: {
                username: req.body.username
              }
            }
          }
        })
        .then(
          function(resp) {
            resp.hits.hits.forEach(function(hit) {
              userToken = hit;
            });
            if (userToken == null) {
              res.status(400).json({
                message: "employee not found",
                employee: false
              });
            } else {
              console.log("employee result is", userToken);
              var dynamicpassword = generator.generate({
                length: 10,
                numbers: true
              });
              passwordtobesend = dynamicpassword;
              personalemail = userToken._source.personalemail;
              employeeid = userToken._source.employeeid;
              companyemail = userToken._source.officeemail;
              employeename =
                userToken._source.firstname +
                " " +
                userToken._source.middlename +
                " " +
                userToken._source.lastname;
              console.log(employeeid, userToken._source.employeeid);
              client.update(
                {
                  index: "employees",
                  id: employeeid,
                  type: "employee",
                  body: {
                    script: {
                      lang: "painless",
                      inline:
                        "ctx._source.emailverified = params.emailverified;ctx._source.password = params.password",
                      params: {
                        password: bcrypt.hashSync(dynamicpassword, 8),
                        emailverified: "No"
                      }
                    }
                  }
                },
                function(err, resp, status) {
                  if (err) {
                    console.log("debug err");
                    console.log(err);
                    res.status(400).json({
                      message: "Error while  updating email verified status",
                      status: status,
                      error: err
                    });
                  } else {
                    var token = jwt.sign({ id: resp._id }, config.secret, {
                      expiresIn: 86400 // expires in 24 hours
                    });
                    var emailres = sendrestpassword(
                      passwordtobesend,
                      personalemail,
                      companyemail,
                      employeename,
                      token,
                      resp,
                      res,
                      status
                    );
                    //res.status(200).send({ auth: true, accessToken: token });
                  }
                }
              );
            }
          },
          function(err) {
            console.trace(err.message);
          }
        );
    } else {
      res.status(400).send({ Message: "Severisdown" });
    }
  });

  async function sendrestpassword(
    password,
    personalmail,
    aaravemail,
    name,
    token,
    resp,
    res,
    status
  ) {
    transporter.sendMail(
      {
        from: "nagarajesh.venturi@aaravsolutions.com",
        to: personalmail,
        //cc:managermail
        subject: "Temporary Password to reset",
        html:
          '<body style="font-size: 10px;font-family: Bitter;">\n' +
          "<p>Hello " +
          name +
          ",</p>\n<p>Here is the temporary password to reset</p>\n" +
          "<p>Password : " +
          password +
          "</p>\n" +
          "<p>Regards,</p>\n" +
          "<p>Nagarajesh Venturi</p>" +
          "</body>"
      },
      function(err, reply) {
        if (err) {
          console.log(err && err.stack);
          res.status(400).json({
            message: "Issue with sending password to employee contact admin",
            index: false
          });
        }
        if (reply) {
          console.log(reply);
          res.status(200).send({ auth: true, accessToken: token });
        }
      }
    );
  }
};
