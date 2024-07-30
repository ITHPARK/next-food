import { PrismaClient } from '@prisma/client'
import * as data from "../data/map_data.json";

const prisma = new PrismaClient()

const seedData = async() => {
    data?.["DATA"]?.map(async(store) => {
        const storeData = {
            phone: store?.tel_no,
            address: store?.rdn_code_nm,
            lat: store?.y_dnts,
            lng: store?.x_cnts,
            name: store?.upso_nm,
            category: store?.bizcnd_code_nm,
            storeType: store?.cob_code_nm,
            foodCertifyName: store?.crtfc_gbn_nm,
        }

        const res = await prisma.store.create({
            data: storeData,
        });

        console.log(res);
    });

    
}

const main = async() => {
    await seedData();
}

main().catch((error) => {
    console.log(error);
    process.exit(1);
}).finally(() => {
    prisma.$disconnect();
});