import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

@Entity("Observation")
export class Observation {
  @PrimaryGeneratedColumn({ name: "id" })
  id?: number;
  //   @UpdateDateColumn()
  //   updatedDate: Date;

  @Column({ name: "ParticipantName" })
  ParticipantName: string;
  @Column({ name: "MediaName", default: "" })
  MediaName: string;
  @Column({ name: "MediaType", default: "N/A" })
  MediaType: string;
  @Column({ name: "Level", default: null, type: "int" })
  Level?: number;
  @Column({ name: "Orientation", default: "" })
  Orientation: string;
  @Column({ name: "SegmentName", default: "" })
  SegmentName: string;
  @Column({ name: "SegmentEnd", default: null, type: "int" })
  SegmentEnd: number;
  @Column({ name: "SegmentDuration", default: null, type: "int" })
  SegmentDuration: number;
  @Column({ name: "KeyPressEvent", default: "" })
  KeyPressEvent?: string;
  @Column({ name: "FixationIndex", default: null, type: "int" })
  FixationIndex: number;
  @Column({ name: "PupilLeft", default: null, type: "float" })
  PupilLeft?: number;
  @Column({ name: "PupilRight", default: null, type: "float" })
  PupilRight?: number;
  @Column({ name: "InputFileName" })
  InputFileName: string;
}
