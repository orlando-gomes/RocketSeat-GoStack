const express = require('express');

const server = express();

server.use(express.json());

const projs = [
  {id: 1, title: "Projeto 1", tasks: ["task1_1", "task2_1", "task3_1"] },
  {id: 2, title: "Projeto 2", tasks: ["task1_2", "task2_2", "task3_2"] },
  {id: 3, title: "Projeto 3", tasks: ["task1_3", "task2_3", "task3_3"] }
]

const validateId = (req, res, next)=>{
  const pid = req.params.id;
  const theProject = projs.find((proj)=>{
    return proj.id == req.params.id;
  })
  if (!theProject) {
    return res.status(400).json({ error: 'Project not found'})
  }
  req.project = theProject;
  req.projectIndex = projs.indexOf(theProject);
  next();
}

const generateId = ()=>{
  var greaterId = 1;

  if (projs.length>0) {
    projs.forEach((pr)=>{
      if (pr.id>greaterId) {
        greaterId = pr.id;
      }
    })
    greaterId+=1;
  }
  return greaterId;
}

const validateName = (req, res, next)=>{
  if (!req.body.name) {
    return res.status(400).json({error: 'Name is required'})
  }
  next();
}

//Fetch all projects
server.get('/projects', (req, res)=> {
  if (projs.length==0) {
    return res.json({msg: 'There is not projects to be showed'});
  }
  return res.json(projs);
})

//fetch project by id
server.get('/projects/:id', validateId, (req, res)=>{
  return res.json(req.project);
})

//delete project
server.delete('/projects/:id', validateId, (req, res)=>{
  projs.splice(req.projectIndex, 1);
  return res.json({msg: 'Project deleted'});

})

//create project by name. Generates id
server.post('/projects', validateName, (req, res)=>{
  projs.push({
    id: generateId(),
    name: req.body.name,
    tasks: []
  });
  return res.json(projs);
})

//create a project's task by name
server.post('/projects/:id/tasks', validateId, validateName, (req, res)=>{
  projs[req.projectIndex].tasks.push(req.body.name);
  return res.json(projs);
})

//update a project's name
server.put('/projects/:id', validateId, validateName, (req, res)=>{
  projs[req.projectIndex].title = req.body.name;
  return res.json(projs);
})

server.listen(3000);