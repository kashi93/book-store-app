import BookSeeder from "./seeder/book-seeder";
import CustomerSeeder from "./seeder/customer-seeder";
import * as cliProgress from 'cli-progress';
import OrderSeeder from "./seeder/order-seeder";

const init = async () => {
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    const seeders = await Promise.all([
        new BookSeeder(),
        new CustomerSeeder(),
        new OrderSeeder()
    ].map(async (seed) => {
        await seed.init();
        return seed;
    }))

    bar.start(seeders.map(seed => seed.total).reduce((a, b) => a + b, 0), 0, {
        speed: "N/A"
    });

    for (let i = 0; i < seeders.length; i++) {
        await seeders[i].seed(bar);
    }

    bar.stop();
}

init()