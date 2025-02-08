import prisma from "../../../shared/prisma";

const deleteForgetRequest = async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const result = await prisma.forgetRequest.deleteMany({
        where: {
            createdAt: {
                lt: fiveMinutesAgo,
            },
        },
    });

    console.log(`${result.count} records deleted`);
};

export const cronService = {
    deleteForgetRequest
}