const express = require('express');

const server = express();

server.use(express.json());

var reqsCounter = 0;

var projs = [
  {id: '1', title: "Projeto 1", tasks: ["task1_1", "task2_1", "task3_1"] },
  {id: '2', title: "Projeto 2", tasks: ["task1_2", "task2_2", "task3_2"] },
  {id: '3', title: "Projeto 3", tasks: ["task1_3", "task2_3", "task3_3"] }
]

const idValidation = (req, res, next)=>{
  const theProject = projs.find((proj)=>{
    if (proj.id == req.params.id) {
      req.index = projs.indexOf(proj);
      return true;
    }
    return false;
  })
  if (!theProject) {
    return res.status(400).json({error: 'Project does not exist'})
  }
  req.project = theProject;
  next();
}

//middleware de log
server.use((req, res, next)=>{
  reqsCounter+=1;
  console.log('Method: '+ req.method+ '. Route: '+ req.path +'. Number of requisitions: '+ reqsCounter);
  next();
})

//test route
server.get('/teste', (req, res)=>{
  return res.json({msg: 'Test OK!'})
})

//fetch all projects
server.get('/projects', (req, res)=>{
  if (projs.length==0) {
    return res.json({msg: 'There is no project yet'})
  }
  return res.json(projs);
})

//fetch a project by id
server.get('/projects/:id', idValidation, (req, res)=>{
  return res.json(req.project);
})

server.delete('/projects/:id', idValidation, (req, res)=>{
  projs.splice(req.index, 1);
  return res.json({msg: 'Project deleted'});
})

//create project
server.post('/projects', (req, res)=>{
  const {id, title} = req.body;
  const tasks = [];
  projs.push({id, title, tasks});
  res.json(projs);
})

//create task
server.post('/projects/:id/tasks', idValidation, (req, res)=>{
  const {title} = req.body;
  req.project.tasks.push(title);
  res.json(projs);
})

//update project
server.put('/projects/:id', idValidation, (req, res)=>{
  req.project.title = req.body.title;
  res.json(projs);
})

server.listen(3000);
