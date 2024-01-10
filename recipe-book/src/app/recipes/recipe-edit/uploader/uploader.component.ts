import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
})
export class UploaderComponent implements OnInit {
  @Input() file: File;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  recipeForm: FormGroup;
  @Output() downloadUrlReady = new EventEmitter<string>();
  fileName: string;

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore) {}

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {
    console.log(`this.file.name: ${this.file.name}`);

    this.fileName = `${Date.now()}_${this.file.name}`
    // The storage path
    const path = `recipes/${this.fileName}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log), // tap into the stream
      // The file's download URL
      finalize(async () => { // finalize is called when the task is complete, this is where we would update our database
        this.downloadURL = await ref.getDownloadURL().toPromise();

        this.db.collection('files').add( { downloadURL: this.downloadURL, path });
        
        this.downloadUrlReady.emit(this.downloadURL);
      }),
    );
  }

  deleteAttachment() {
    const path = `recipes/${this.fileName}`; // Path to the file you want to delete
    this.downloadURL = '';

    this.storage.ref(path).delete();
    this.downloadUrlReady.emit(this.downloadURL);

    // this.storage.ref(path).delete().subscribe(
    //   () => {
    //     console.log('File deleted successfully!');
    //     this.downloadUrlReady.emit(this.downloadURL);
    //   },
    //   (error) => {
    //     console.error('Error deleting file:', error);
    //   });
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}