///<reference types="Cypress"/>
 
const Base_Url = "https://api.github.com";
const username = "devendra684";
// const token = "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";
const token = "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";

var RepoName = "GitHub-RestAPI";
var RepoDescription = "This repo is created using the GitHub RestAPI";
var UpdatedRepoName = "RepoName-Updated-by-GitHub-RestAPI"
var file_sha = "";
var autolink_id ="";
var RepoTopics = "api,git,github,postman";
var UpdatedRepoTopics = "api,api-testing,git,github,postman,testing";
var ForkedRepoName = "This-is-forked-repo-from-jitenderji1137";

describe("Get repository details from GitHub", () => {
  
    it("1. CREATE A REPOSITORY FOR A AUTHENTICATED USER",() => {
      cy.api({
        method:"POST",
        url:`${Base_Url}/user/repos`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        // auth: {
        //   username: username,
        //   password: token
        // },
        body: {
          name: RepoName,
          description: RepoDescription
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.name).to.eq(RepoName);
        expect(response.body.description).to.eq(RepoDescription);
        expect(response.body.private).to.eq(false);
        cy.log(`Repository ${RepoName} created successfully!`);
        cy.log(`Repository URL: ${response.body.html_url}`);
      })
    });


    it("2. UPDATE A REPOSITORY",() => {
      cy.api({
        method:"PATCH",
        url:`${Base_Url}/repos/${username}/${RepoName}`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        body: {
          name: UpdatedRepoName,
          description: RepoDescription
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(UpdatedRepoName);
        expect(response.body.description).to.eq(RepoDescription);
        cy.log(`Repository ${UpdatedRepoName} Updated Successfully!`);
      })
    });

    it("4. GET A CREATED REPOSITORY",() => {
      cy.api({
        method:"GET",
        url:`${Base_Url}/repos/${username}/${RepoName}`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(UpdatedRepoName);
        cy.log(`Repository Get Successfully!`);
      })
    });

  
    it("5. CREATE A FORK", function() {
  
      cy.api({
        method: "POST",
        url: `${Base_Url}/repos/jitenderji1137/Free-Netflix/forks`,
        auth: {
          username: username,
          password: token
        },
        body: {
          "owner": "jitenderji1137",
          "repo": "Free-Netflix",
          "name": ForkedRepoName
        }
      }).then(response => {
        expect(response.status).to.eq(202);
        expect(response.body.full_name).to.eq(`${username}/${ForkedRepoName}`);
        cy.log(`Forked Repo Created Successfully!`);
      });
    });
  
    it("6. LIST FORKS",() => {
      cy.api({
        method:"GET",
        url:`${Base_Url}/repos/jitenderji1137/Free-Netflix/forks`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`Forked List of Repo generated Successfully!`);
      })
    });
  
    it("7. LIST REPOSITORIES FOR A USER",() => {
      cy.api({
        method:"GET",
        url:`${Base_Url}/users/${username}/repos`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`User all Repository list is Generated Successfully!`);
      })
    });
  
    it("8. LIST REPOSITORY LANGUAGE",() => {
      cy.api({
        method:"GET",
        url:`${Base_Url}/repos/${username}/${ForkedRepoName}/languages`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`Repository Language List generated Successfully!`);
      })
    });
  
    it("9. LIST PUBLIC REPOSITORIES",() => {
      cy.api({
        method:"GET",
        url:`${Base_Url}/repositories`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`All Public Repository Listed Successfully!`);
      })
    });
  
    it("10. CREATE OR UPDATE FILE CONTENT",() => {
      cy.api({
        method:"PUT",
        url:`${Base_Url}/repos/${username}/${RepoName}/contents/test1.txt`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        body: {
          "message": "creating a new text file",
          //change the Content value from string to Base64 format(text-to-binary encoding)
          "content": "SGkgCgpZb3VyIEZpbGUgaXMgU3VjY2Vzc2Z1bGx5IENyZWF0ZWQ="
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        file_sha = response.body.content.sha;
        expect(response.body.content.name).to.eq("test1.txt");
        expect(response.body.content.sha).to.eq(file_sha);
        cy.log(`Text file created Successfully!`);
      })
    });
  
    it("11. DELETE A FILE",() => {
      cy.api({
        method:"DELETE",
        url:`${Base_Url}/repos/${username}/${RepoName}/contents/test1.txt`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        body: {
          "message": "Delete commit message",
          "committer": {
            "name": "Dev",
            "email": "dev@github.com"
          },
          "sha": `${file_sha}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.content).to.eq(null);
        cy.log(`File Deleted Successfully!`);
      })
    });
  
    it("CREATE A RELEASE & TAG",() => {
      cy.api({
        method:"POST",
        url:`${Base_Url}/repos/${username}/${RepoName}/releases`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        body: {
          "tag_name": "v1.0.0",
          "target_commitish": "main",
          "name": "v1.0.0",
          "body": "Description of the release"
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.url).to.eq(`${response.body.url}`);
        cy.log(`Release and Tag created successfully!`);
      })
    });
  
    it("12. LIST REPOSITORY TAGS",() => {
      cy.api({
        method:"GET",
        url:`${Base_Url}/repos/${username}/${RepoName}/tags`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`Tags list generated successfully!`);
      })
    });
  
    it("13. CREATE AN AUTOLINK REFERENCE FOR A REPOSITORY",() => {
      cy.api({
        method:"POST",
        url:`${Base_Url}/repos/${username}/${RepoName}/autolinks`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        body: {
          "key_prefix": "TICKET-API_testing",
        "url_template": "https://example.com/TICKET?query=<num>"
        }
      }).then((response) => {
        autolink_id = response.body.id
        expect(response.status).to.eq(201);
        expect(response.body.id).to.eq(autolink_id);
        cy.log(`Autolink generated Successfully!`);
      })
    });
  
    it("CREATE REPOSITORY TOPICS",() => {
      cy.api({
        method:"PUT",
        url:`${Base_Url}/repos/${username}/${RepoName}/topics`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        // auth: {
        //   username: username,
        //   password: token
        // },
        body: {
          "names": [
              "git",
              "github",
              "postman",
              "api",
              "testing",
              "api-testing"
          ]
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`Repository Topics created successfully!`);
      })
    });
  
    it("14. GET ALL REPOSITORY TOPICS",() => {
      cy.api({
        method:"GET",
        url:`${Base_Url}/repos/${username}/${RepoName}/topics`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(200);
        RepoTopics = response.body.names;
        cy.log(`RepoTopics created Successfully!`);
      })
    });
  
    it("15. GET AN AUTOLINK REFERENCE FOR A REPOSITORY",() => {
      cy.api({
        method:"GET",
        url:`${Base_Url}/repos/${username}/${RepoName}/autolinks/${autolink_id}`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(autolink_id);
        cy.log(`Autolink Reference generated successfully!`);
      })
    });
  
    it("16.DELETE FROM AN AUTOLINK REFERENCE FOR A REPOSITORY",() => {
      cy.api({
        method:"DELETE",
        url:`${Base_Url}/repos/${username}/${RepoName}/autolinks/${autolink_id}`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(204);
        cy.log(`Repository Autolink Deleted Successfully!`);
      })
    });
  
    it("18. REPLACE ALL REPOSITORY TOPICS",() => {
      cy.api({
        method:"PUT",
        url:`${Base_Url}/repos/${username}/${RepoName}/topics`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
          body: {
              "names": [
                "octocat",
                "atom",
                "electron",
                "api"
            ]
          }
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`All Topics Updated Successfully!`);
      })
    });

  
    it("3. DELETE A REPOSITORY",() => {
      cy.api({
        method:"DELETE",
        url:`${Base_Url}/repos/${username}/${RepoName}`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(204);
        cy.log(`Repository Deleted Successfully!`);
      })
    });

    it("DELETE FORKED REPO",() => {
      cy.api({
        method:"DELETE",
        url:`${Base_Url}/repos/${username}/${ForkedRepoName}`,
        headers:{
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
      }).then((response) => {
        expect(response.status).to.eq(204);
        cy.log(`Forked Repository Deleted Successfully!`);
      })
    });


  });
  