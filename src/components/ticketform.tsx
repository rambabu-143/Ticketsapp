"use client";
import { useState } from "react";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { ticketSchema } from "../../ValidationSchemas/ticket";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Ticket } from "@prisma/client";

type Tickeformdata = z.infer<typeof ticketSchema>;

interface Props {
  ticket?: Ticket;
}

const Ticketform = ({ ticket }: Props) => {
  const form = useForm<Tickeformdata>({
    resolver: zodResolver(ticketSchema),
  });

  const [issubmitting, setissubmitting] = useState(false);
  const [error, seterror] = useState("");
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    try {
      setissubmitting(true);
      seterror("");
      if (ticket) {
        await axios.patch("/api/tickets/" + ticket.id ,values);
      } else {
        await axios.post("/api/tickets", values);
      }
      router.push("/tickets");
      router.refresh();
    } catch (error) {
      console.log(error);
      seterror("Unknown error");
      setissubmitting(false);
    }
  }
  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          className=" w-full space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            defaultValue={ticket?.title}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title ticket" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            defaultValue={ticket?.description}
            render={({ field }) => (
              <SimpleMdeReact placeholder="Description" {...field} />
            )}
          />

          <div className="flex w-full space-x-4">
            <FormField
              control={form.control}
              name="status"
              defaultValue={ticket?.status}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Status..." defaultValue={ticket?.status}></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="STARTED">Started</SelectItem>
                      <SelectItem value="CLOSE">Close</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="priority"
              defaultValue={ticket?.priority}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority..." defaultValue={ticket?.priority}></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            ></FormField>
          </div>
          <Button type="submit" disabled={issubmitting}>
            {ticket ? 'Update Tiket':"Create Ticket"}
          </Button>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>

    </div>
  );
};

export default Ticketform;
