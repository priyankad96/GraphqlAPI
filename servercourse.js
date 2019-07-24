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
        course(id:Int!):[Course]
        courses(topic:String):[Course]
        allCourses:[Course]
   }
   type Mutation{
        updateTopicById(id:ID!,topic:String!):[Course]
       updateCourse(id:ID,title:String!,author:String!,description:String!,topic:String!,url:String!):[Course]
       insertCourse(id:ID,title:String!,author:String!,description:String!,topic:String!,url:String!):[Course]
       
   }
   type Course{
        id:ID
        title:String
        author:String
        description:String
        topic:String
        url:String
   }`;


var getCourse = function (parent,args)  {
   return coursesData.findAll({where:{id:args.id}});
};

var getCourses = function (parent, args) {
    if(args.topic){
        return coursesData.findAll({where:{topic:args.topic}})
    }else{
        return coursesData.findAll();
    }
};

var allCourses=()=>{
    return coursesData.findAll();
};

var updateTopicById=(parent,args)=>{
    coursesData.update({topic:args.topic},{where:{id:args.id}});
    return coursesData.findAll({where:{id:args.id}})
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
    const id=l;
    const title=args.title;
    const author=args.author;
    const description=args.description;
    const topic=args.topic;
    const url=args.url;
    let data=new coursesData();
    data={id:l,title,author,description,topic,url};
    console.log("sdsd---",data);
    data.save();
    return coursesData.findAll({where:{id:l}});
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


