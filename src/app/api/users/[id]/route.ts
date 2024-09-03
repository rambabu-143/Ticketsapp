import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/db";
import bcrypt from "bcryptjs";
import { userSchema } from "../../../../../ValidationSchemas/users";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!user) {
    return NextResponse.json({ error: "User Not Found" }, { status: 400 });
  }
  if (body?.password && body.password !="") {
    const hashpassword = await bcrypt.hash(body.password, 10);
    body.password = hashpassword;
  }else{
    delete body.password
  }
  if (user.username !== body.username) {
    const duplicateusername = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (duplicateusername) {
      return NextResponse.json(
        {
          message: "Duplicate Username",
        },
        { status: 409 }
      );
    }
  }

  const updateuser = await prisma.user.update({
    where:{id:user.id},
    data:{
        ...body
    }
  })
  return NextResponse.json(updateuser)
}
