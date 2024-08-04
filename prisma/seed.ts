import { PrismaClient } from '@prisma/client'
import * as data from "../data/map_data.json";

const prisma = new PrismaClient();

const seedData = async () => {
    // `for...of` 루프를 사용하여 비동기 작업을 순차적으로 실행합니다.
    for (const store of data?.["DATA"] || []) {
        const storeData = {
            phone: store?.tel_no,
            address: store?.rdn_code_nm,
            lat: store?.y_dnts,
            lng: store?.x_cnts,
            name: store?.upso_nm,
            category: store?.bizcnd_code_nm,
            storeType: store?.cob_code_nm,
            foodCertifyName: store?.crtfc_gbn_nm,
        };

        try {
            const res = await prisma.store.create({
                data: storeData,
            });

            console.log(res);
        } catch (error) {
            console.error('Error creating store:', storeData, error);
        }
    }
};

const main = async () => {
    await seedData();
};

main().catch((error) => {
    console.error('Main error:', error);
    process.exit(1);
}).finally(() => {
    prisma.$disconnect();
});