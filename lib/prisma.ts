import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({log: ["query","error","error","info"]});
} else {
    if(!global.prisma){
        global.prisma = new PrismaClient({log: ["query","error","error","info"]});
    }
    prisma = global.prisma;
}

export default prisma;