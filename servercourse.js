var express = require('express');
var cors = require('cors');
var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');
const { ApolloServer, gql } = require('apollo-server-express');
var coursesData=require('./schema/course');

//-------GraphQL Schema without Apollo-Server-------
// var schema = buildSchema(`
//    type Query {
//         course(id:Int!):Course
//         courses(topic:String):[Course]
//         allCourses:[Course]
//    }
//    type Mutation{
//         updateTopicById(id:Int!,topic:String!):Course
//
//    }
//    type Course{
//         id:Int
//         title:String
//         author:String
//         description:String
//         topic:String
//         url:String
//    }
//  `);

// updateCourse(id:ID!,title:String!,author:String!,description:String!,topic:String!,url:String!):Course
//-------------Schema with Apollo Server------
var schema = gql `
   type Query {
        course(id:ID!):Course
        courses(topic:String):[Course]
        allCourses:[Course]
   }
   type Mutation{
        updateTopicById(id:ID!,topic:String!):Course
       updateCourse(id:ID,title:String!,author:String!,description:String!,topic:String!,url:String!):Course
       insertCourse(id:ID,title:String!,author:String!,description:String!,topic:String!,url:String!):Course
       
   }
   type Course{
        id:ID
        title:String
        author:String
        description:String
        topic:String
        url:String
   }`;


var getCourse = function (parent, args)  {
    console.log("gjji",args);
    var id = Number(args.id);
   var a= coursesData.findAll({
       where: {
           id: id
       }
   });
   console.log(a);
   return 1;
};

var getCourses = function (parent, args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course =>{
                console.log(course);
            return  course.topic === topic
        }
        )
    } else {
        return coursesData;
    }
};

var allCourses=()=>{
    return coursesData.findAll();
};

var updateTopicById=(parent,args)=>{
    console.log('dfd',args);
    let id=args.id;
    let topic=args.topic;
    coursesData.map(course=>{
        if(course.id==id){
            course.topic=topic
        }
    });
   return coursesData.filter(course=>{
        if(course.id==id){
            return course
        }
    })[0];
};

var updateCourse=(parent,args)=>{
    console.log(args);
    let index=coursesData.findIndex(e=>e.id==args.id);
    let newData;
    if(index!==-1){
        newData={
            ...coursesData[index],
            ...args
        };
        coursesData.splice(index,1,newData);
        return coursesData[index];
    }
};

var insertCourse=(parent,args)=>{
    console.log(args);
    coursesData.push(args);
    let l=coursesData.length;
    return coursesData[l-1];
};

var coursesData1 = [
    {
        id: 1,
        title: 'The complete Node Js Developer Course',
        author: 'Andrew Med',
        description: 'Learn Node js by building real world application',
        topic: 'Node JS',
        url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
    },
    {
        id: 2,
        title: 'The complete ReactJs Developer Course',
        author: 'Andrew Med',
        description: 'Learn React js by building real world application',
        topic: 'React JS',
        url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
    },
    {
        id: 3,
        title: 'The complete Angular Developer Course',
        author: 'Andrew Med',
        description: 'Learn Angular by building real world application',
        topic: 'Angular',
        url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
    },
];


//Root Resolver without Apollo-server
// var root = {
//     course: getCourse,
//     courses: getCourses,
//     allCourses:allCourses,
//     updateTopicById:updateTopicById,
// };


//Root Resolver with Apollo-server
var root = {
    Query:{
        course: getCourse,
        courses: getCourses,
        allCourses:allCourses,
    },
    Mutation:{
        updateTopicById:updateTopicById,
        updateCourse:updateCourse,
        insertCourse:insertCourse,
    }
};


//---without apollo server
// var app = express();
// app.use(cors());
// app.use('/graphql', express_graphql({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
// }));
// app.listen(4000, () => console.log('Express Graphql server Running on 4000'));

//-----------   with apollo server----------
var app = express();
app.use(cors());
const server=new ApolloServer({
    typeDefs:schema,
    resolvers:root,
});

server.applyMiddleware({app,path:'/graphql'});
app.listen(4000, () => console.log('Express Graphql server Running on 4000'));


