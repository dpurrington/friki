import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "../../logging/log-util"

export async function GET(request: NextRequest) {
    const logger = getLogger("main");
    logger.trace('get articles');
    logger.trace(request.url);
    return NextResponse.json({foo: "bar"});
}