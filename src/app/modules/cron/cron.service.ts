import prisma from "../../../shared/prisma";

const deleteForgetRequest = async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    await prisma.forgetRequest.deleteMany({
        where: {
            createdAt: {
                lt: fiveMinutesAgo,
            },
        },
    });
};

export const cronService = {
    deleteForgetRequest
}